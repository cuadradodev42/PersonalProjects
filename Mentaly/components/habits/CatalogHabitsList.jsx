'use client';

import { useMemo, useState } from 'react';
import { HABIT_CATALOG } from '@/lib/habit_catalog';
import { AREA_LABELS } from '@/lib/areas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { createHabit } from '@/lib/firestore';

export default function CatalogHabitsList({ existingHabits = [], onActivated }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const existingNames = new Set(existingHabits.map(h => `${h.name}|${h.category}`));

  const grouped = useMemo(() => {
    const byCat = {};
    HABIT_CATALOG.forEach(h => {
      if (query && !h.name.toLowerCase().includes(query.toLowerCase())) return;
      if (!byCat[h.category]) byCat[h.category] = [];
      byCat[h.category].push(h);
    });
    return byCat;
  }, [query]);

  const handleActivate = async (h) => {
    const key = `${h.name}|${h.category}`;
    if (existingNames.has(key)) {
      toast({ title: 'Ya activo', description: `${h.name} ya está en tus hábitos`, variant: 'default' });
      return;
    }
    const res = await createHabit(user.uid, { name: h.name, category: h.category, frequency: 'daily', catalogId: h.id });
    if (res.success) {
      toast({ title: 'Hábito activado', description: `${h.name} (${h.category})`, variant: 'success' });
      onActivated && onActivated();
    } else {
      toast({ title: 'Error', description: 'No se pudo activar el hábito', variant: 'destructive' });
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Catálogo por categorías</h2>
        <div className="w-64">
          <Input placeholder="Buscar hábito…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="space-y-6">
        {AREA_LABELS.map(cat => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {(grouped[cat] || []).map(h => {
                const active = existingNames.has(`${h.name}|${h.category}`);
                return (
                  <div key={h.id} className={`flex items-center justify-between p-3 rounded border ${active ? 'bg-gray-50' : 'bg-white'}`}>
                    <div>
                      <div className="text-sm font-medium">{h.name}</div>
                      <div className="text-xs text-gray-400">{h.category}</div>
                    </div>
                    <Button size="sm" variant={active ? 'outline' : 'default'} disabled={active} onClick={() => handleActivate(h)}>
                      {active ? 'Activo' : 'Activar'}
                    </Button>
                  </div>
                );
              })}
              {(!grouped[cat] || grouped[cat].length === 0) && (
                <div className="text-xs text-gray-400">Sin resultados</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


