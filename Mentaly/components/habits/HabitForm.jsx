'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { createHabit, updateHabit } from '@/lib/firestore';
import { AREA_LABELS } from '@/lib/areas';
import { toast } from '@/components/ui/use-toast';

const CATEGORIES = AREA_LABELS;

export default function HabitForm({ habit = null, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!habit;

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setCategory(habit.category);
    }
  }, [habit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para el hábito",
        variant: "destructive"
      });
      return;
    }

    if (!category) {
      toast({
        title: "Error",
        description: "Por favor selecciona una categoría",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    let result;
    if (isEditing) {
      result = await updateHabit(user.uid, habit.id, {
        name: name.trim(),
        category,
      });
    } else {
      result = await createHabit(user.uid, {
        name: name.trim(),
        category,
        frequency: 'daily',
      });
    }

    if (result.success) {
      toast({
        title: "¡Éxito!",
        description: isEditing ? "Hábito actualizado correctamente" : "Hábito creado correctamente",
        variant: "success"
      });
      
      setName('');
      setCategory('');
      
      if (onSuccess) {
        onSuccess();
      }
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar el hábito",
        variant: "destructive"
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="habit-name">Nombre del Hábito</Label>
        <Input
          id="habit-name"
          type="text"
          placeholder="Ej: Hacer ejercicio 30 minutos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="habit-category">Categoría</Label>
        <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
          <SelectTrigger id="habit-category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Hábito')}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

