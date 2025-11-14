'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getHabits, getUserProfile } from '@/lib/firestore';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { suggestHabits } from '@/lib/suggestions';
import { toast } from '@/components/ui/use-toast';
import { createHabit } from '@/lib/firestore';

export default function SuggestedHabits() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingId, setCreatingId] = useState(null);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const profile = await getUserProfile(user.uid);
    const habits = await getHabits(user.uid);
    const snapsRef = collection(db, 'users', user.uid, 'life_wheel_snapshots');
    const snapsQ = query(snapsRef, orderBy('weekKey', 'asc'));
    const snapsSnap = await getDocs(snapsQ);
    const snapshots = [];
    snapsSnap.forEach(d => snapshots.push({ id: d.id, ...d.data() }));

    if (profile.success && habits.success) {
      const s = suggestHabits({ areas: profile.data.areas || {}, currentHabits: habits.data || [], snapshots });
      setSuggestions(s);
    }
    setLoading(false);
  };

  const handleCreate = async (sug, idx) => {
    setCreatingId(idx);
    const result = await createHabit(user.uid, { name: sug.name, category: sug.category, frequency: 'daily', catalogId: sug.catalogId });
    if (result.success) {
      toast({ title: 'Hábito creado', description: `${sug.name} (${sug.category})`, variant: 'success' });
      await load();
    } else {
      toast({ title: 'Error', description: 'No se pudo crear el hábito', variant: 'destructive' });
    }
    setCreatingId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sugerencias de Hábitos</CardTitle>
          <CardDescription>Analizando tus áreas prioritarias…</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-gray-500">
          Cargando…
        </CardContent>
      </Card>
    );
  }

  if (!suggestions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sugerencias de Hábitos</CardTitle>
          <CardDescription>
            Actualmente no hay sugerencias. ¡Excelente equilibrio!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sugerencias de Hábitos</CardTitle>
        <CardDescription>Basadas en baja satisfacción, alta importancia o evolución negativa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((sug, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <div className="font-medium">{sug.name}</div>
                <div className="text-xs text-gray-500">{sug.category} • {sug.reason}</div>
              </div>
              <Button size="sm" onClick={() => handleCreate(sug, idx)} disabled={creatingId === idx}>
                {creatingId === idx ? 'Creando…' : 'Añadir'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


