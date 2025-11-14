'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getHabits, deleteHabit } from '@/lib/firestore';
import HabitCard from '@/components/habits/HabitCard';
import AddHabitButton from '@/components/habits/AddHabitButton';
import Modal from '@/components/shared/Modal';
import HabitForm from '@/components/habits/HabitForm';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import QuickAddHabit from '@/components/habits/QuickAddHabit';
import CatalogHabitsList from '@/components/habits/CatalogHabitsList';

export default function HabitsPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    setLoading(true);
    const result = await getHabits(user.uid);
    
    if (result.success) {
      setHabits(result.data);
    }
    
    setLoading(false);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (habitId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      return;
    }

    const result = await deleteHabit(user.uid, habitId);
    
    if (result.success) {
      toast({
        title: "Hábito eliminado",
        description: "El hábito ha sido eliminado correctamente",
        variant: "success"
      });
      loadHabits();
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el hábito",
        variant: "destructive"
      });
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingHabit(null);
    loadHabits();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Hábitos</h1>
        <p className="mt-2 text-gray-600">
          Gestiona todos tus hábitos en un solo lugar
        </p>
      </div>

      <QuickAddHabit onCreated={loadHabits} />

      {habits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes hábitos creados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza tu viaje creando tu primer hábito
            </p>
            <p className="text-sm text-gray-500">
              Usa el botón + en la esquina inferior derecha para agregar un nuevo hábito
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CatalogHabitsList existingHabits={habits} onActivated={loadHabits} />

      <AddHabitButton onHabitAdded={loadHabits} />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingHabit(null);
        }}
        title="Editar Hábito"
        description="Actualiza la información de tu hábito"
      >
        <HabitForm
          habit={editingHabit}
          onSuccess={handleEditSuccess}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingHabit(null);
          }}
        />
      </Modal>
    </div>
  );
}

