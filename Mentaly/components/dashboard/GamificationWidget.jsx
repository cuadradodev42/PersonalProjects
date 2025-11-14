'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { getUserGamification, getRecentRewards, computeLevelFromXp, useFreezeToken } from '@/lib/gamification';
import { Button } from '@/components/ui/button';

export default function GamificationWidget() {
  const { user } = useAuth();
  const [state, setState] = useState({ xp: 0, level: 1, streakCount: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const g = await getUserGamification(user.uid);
      setState(g);
      const r = await getRecentRewards(user.uid, 5);
      setRecent(r);
    })();
  }, [user]);

  const prog = computeLevelFromXp(state.xp);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progreso y Recompensas</CardTitle>
        <CardDescription>Tu nivel, XP, racha y últimos premios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Nivel</div>
            <div className="text-2xl font-bold">{prog.level}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Racha</div>
            <div className="text-2xl font-bold">{state.streakCount}d</div>
          </div>
          <div className="col-span-2">
            <div className="text-sm text-gray-500">XP</div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-indigo-500" style={{ width: `${Math.min(100, (prog.current / prog.needed) * 100)}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{prog.current} / {prog.needed}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Freeze</div>
            <div className="text-2xl font-bold">{state.freezeTokens ?? 0}</div>
            <div className="mt-2">
              <Button size="sm" variant="outline" disabled={(state.freezeTokens ?? 0) <= 0} onClick={async () => {
                const res = await useFreezeToken(user.uid);
                if (res.success) {
                  const g = await getUserGamification(user.uid);
                  setState(g);
                }
              }}>Usar Freeze</Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold mb-2">Últimas recompensas</div>
          {recent.length === 0 ? (
            <div className="text-sm text-gray-500">Aún no has recibido recompensas</div>
          ) : (
            <div className="space-y-2">
              {recent.map(r => (
                <div key={r.id} className="flex items-center justify-between text-sm p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <span>{r.icon}</span>
                    <span className="font-medium">{r.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{r.rarity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


