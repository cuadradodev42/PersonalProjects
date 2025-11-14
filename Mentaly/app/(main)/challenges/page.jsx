'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENT_CATALOG } from '@/lib/achievement_catalog';
import { CHALLENGE_CATALOG } from '@/lib/challenge_catalog';
import { AREA_LABELS } from '@/lib/areas';
import { activateChallenge, getActiveChallenges } from '@/lib/firestore';
import { toast } from '@/components/ui/use-toast';

export default function ChallengesPage() {
  const { user } = useAuth();
  const [active, setActive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locks, setLocks] = useState({});

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const res = await getActiveChallenges(user.uid);
    if (res.success) setActive(res.data);
    // leer locks del usuario (descansos por categoría)
    try {
      const snap = await (await import('firebase/firestore')).getDoc((await import('firebase/firestore')).doc((await import('@/lib/firebase')).db, 'users', user.uid));
      if (snap.exists()) setLocks(snap.data().restLocks || {});
    } catch {}
    setLoading(false);
  };

  const grouped = useMemo(() => {
    const byCat = {};
    CHALLENGE_CATALOG.forEach(ch => {
      if (!byCat[ch.category]) byCat[ch.category] = [];
      byCat[ch.category].push(ch);
    });
    return byCat;
  }, []);

  const handleActivate = async (ch) => {
    const res = await activateChallenge(user.uid, ch);
    if (res.success) {
      toast({ title: 'Reto activado', description: ch.name, variant: 'success' });
      load();
    } else {
      toast({ title: 'Bloqueado', description: res.error || 'No se pudo activar', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Retos</h1>
        <p className="mt-2 text-gray-600">Activa retos por categoría. Los demandantes aplican descansos.</p>
      </div>

      {/* Activos */}
      <Card>
        <CardHeader>
          <CardTitle>Retos Activos</CardTitle>
          <CardDescription>Tu progreso actual</CardDescription>
        </CardHeader>
        <CardContent>
          {active.length === 0 ? (
            <div className="text-sm text-gray-500">No tienes retos activos</div>
          ) : (
            <div className="space-y-2">
              {active.map(ch => (
                <div key={ch.id} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <div className="font-medium">{ch.name}</div>
                    <div className="text-xs text-gray-500">{ch.category} • {ch.type} • progreso {ch.progressCount}/{ch.target}</div>
                    {ch.completedAt && <div className="text-xs text-green-600">Completado</div>}
                  </div>
                  {ch.demanding && ch.completedAt && (
                    <span className="text-xs text-rose-600">Descanso {ch.restDays} días</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Catálogo por categoría */}
      <div className="space-y-6">
        {AREA_LABELS.map(cat => (
          <Card key={cat}>
            <CardHeader>
              <CardTitle>{cat}</CardTitle>
              <CardDescription>Retos disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(grouped[cat] || []).map(ch => {
                  const lockTs = locks?.[cat];
                  let locked = false; let lockMsg = '';
                  if (lockTs) {
                    const until = lockTs.toDate ? lockTs.toDate() : new Date(lockTs);
                    if (until > new Date() && ch.demanding) {
                      locked = true; lockMsg = `Descanso activo hasta ${until.toLocaleDateString()}`;
                    }
                  }
                  return (
                    <div key={ch.id} className="flex items-center justify-between p-3 rounded border">
                      <div>
                        <div className="font-medium">{ch.name}</div>
                        <div className="text-xs text-gray-500">{ch.type} • objetivo {ch.target}{ch.windowDays ? ` en ${ch.windowDays}d` : ''} {ch.demanding ? '• Demandante' : ''}</div>
                        {locked && <div className="text-xs text-rose-600">{lockMsg}</div>}
                      </div>
                      <Button size="sm" disabled={locked} onClick={() => handleActivate(ch)}>
                        {locked ? 'Bloqueado' : 'Activar'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


