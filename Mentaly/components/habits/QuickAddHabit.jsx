'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { createHabit } from '@/lib/firestore';
import { AREA_LABELS } from '@/lib/areas';
import { HABIT_CATALOG } from '@/lib/habit_catalog';

export default function QuickAddHabit({ onCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Detectar fragmento de categoría tras '#'
  useEffect(() => {
    const hashIndex = text.lastIndexOf('#');
    if (hashIndex >= 0) {
      const frag = text.slice(hashIndex + 1).trim();
      setFilter(frag);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilter('');
    }
  }, [text]);

  const areaSuggestions = useMemo(() => {
    if (!filter) return AREA_LABELS.slice(0, 6);
    const f = filter.toLowerCase();
    return AREA_LABELS.filter(l => l.toLowerCase().includes(f)).slice(0, 8);
  }, [filter]);

  const nameQuery = useMemo(() => {
    const hashIndex = text.lastIndexOf('#');
    const base = (hashIndex >= 0 ? text.slice(0, hashIndex) : text).trim().toLowerCase();
    return base;
  }, [text]);

  const nameSuggestions = useMemo(() => {
    if (!nameQuery) return HABIT_CATALOG.slice(0, 6);
    return HABIT_CATALOG.filter(h => h.name.toLowerCase().includes(nameQuery)).slice(0, 8);
  }, [nameQuery]);

  const applyCategory = (label) => {
    const hashIndex = text.lastIndexOf('#');
    const base = hashIndex >= 0 ? text.slice(0, hashIndex).trim() : text.trim();
    setText(`${base} #${label}`);
    setShowSuggestions(false);
  };

  const parseInput = () => {
    const hashIndex = text.lastIndexOf('#');
    const baseName = (hashIndex >= 0 ? text.slice(0, hashIndex) : text).trim().toLowerCase();
    // Buscar en catálogo por nombre aproximado
    const match = HABIT_CATALOG.find(h => h.name.toLowerCase() === baseName) || HABIT_CATALOG.find(h => h.name.toLowerCase().includes(baseName));
    if (match) return { catalog: match };
    // Si no coincide con catálogo, permitir selección de categoría pero no crear fuera del catálogo
    const catFrag = hashIndex >= 0 ? text.slice(hashIndex + 1).trim().toLowerCase() : '';
    const category = AREA_LABELS.find(l => l.toLowerCase() === catFrag) || AREA_LABELS.find(l => l.toLowerCase().includes(catFrag));
    return { catalog: null, fallback: { name: baseName, category } };
  };

  const handleCreate = async () => {
    const parsed = parseInput();
    if (!parsed.catalog) {
      toast({ title: 'Catálogo', description: 'Selecciona un hábito del catálogo (escribe y elige por nombre).', variant: 'default' });
      return;
    }
    setSubmitting(true);
    const { name, category } = parsed.catalog;
    const res = await createHabit(user.uid, { name, category, frequency: 'daily', catalogId: parsed.catalog.id });
    setSubmitting(false);
    if (res.success) {
      setText('');
      toast({ title: 'Hábito creado', description: `${name} (${category})`, variant: 'success' });
      onCreated && onCreated();
    } else {
      toast({ title: 'Error', description: 'No se pudo crear el hábito', variant: 'destructive' });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div ref={containerRef} className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex gap-2">
        <Input
          placeholder="Ej: Beber agua #Salud Física"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={submitting}
        />
        <Button onClick={handleCreate} disabled={submitting}>Crear</Button>
      </div>
      {(nameSuggestions.length > 0 || (showSuggestions && areaSuggestions.length > 0)) && (
        <div className="mt-2 border rounded-lg bg-white shadow-sm max-h-72 overflow-auto">
          {/* Sugerencias por nombre */}
          {nameSuggestions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-gray-500">Coincidencias del catálogo</div>
              {nameSuggestions.map((h) => (
                <div
                  key={h.id}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer flex justify-between"
                  onClick={async () => {
                    setText(h.name);
                    setSubmitting(true);
                    const res = await createHabit(user.uid, { name: h.name, category: h.category, frequency: 'daily', catalogId: h.id });
                    setSubmitting(false);
                    if (res.success) {
                      toast({ title: 'Hábito activado', description: `${h.name} (${h.category})`, variant: 'success' });
                      setText('');
                      onCreated && onCreated();
                    } else {
                      toast({ title: 'Error', description: 'No se pudo activar el hábito', variant: 'destructive' });
                    }
                  }}
                >
                  <span>{h.name}</span>
                  <span className="text-xs text-gray-400">{h.category}</span>
                </div>
              ))}
            </div>
          )}
          {/* Sugerencias de categoría (hash) */}
          {showSuggestions && areaSuggestions.length > 0 && (
            <div className="border-t">
              <div className="px-3 py-2 text-xs text-gray-500">Categorías</div>
              {areaSuggestions.map((s) => (
                <div
                  key={s}
                  className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                  onClick={() => applyCategory(s)}
                >
                  #{s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">Consejo: escribe el nombre y añade # para elegir la categoría</p>
    </div>
  );
}


