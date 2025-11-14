'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { AREA_BADGE_CLASSES } from '@/lib/areas';
import { getHabits, getHabitLogs, createHabitLog, isHabitCompletedToday, getAchievements, createAchievement, updateChallengesOnHabitCompletion } from '@/lib/firestore';
import { isSameDay, checkAchievements, checkCategoryAchievements } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { updateUserGamification, generateRewardForHabit, grantReward, XP_VALUES } from '@/lib/gamification';

const CATEGORY_COLORS = AREA_BADGE_CLASSES;

export default function TodaysHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completedToday, setCompletedToday] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingHabit, setProcessingHabit] = useState(null);

  useEffect(() => {
    if (user) {
      loadHabits();
    }
  }, [user]);

  const loadHabits = async () => {
    setLoading(true);
    
    const habitsResult = await getHabits(user.uid);
    
    if (habitsResult.success) {
      const habitsData = habitsResult.data;
      setHabits(habitsData);
      
      // Optimización: obtener logs de hoy en una sola consulta y mapear por habitId
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const logsResult = await getHabitLogs(user.uid, null, today, tomorrow);
      if (logsResult.success) {
        const map = {};
        for (const log of logsResult.data) {
          map[log.habitId] = true;
        }
        setCompletedToday(map);
      }
    }
    
    setLoading(false);
  };

  const handleCheckHabit = async (habitId, checked) => {
    setProcessingHabit(habitId);

    if (checked) {
      // Marcar como completado
      const result = await createHabitLog(user.uid, {
        habitId: habitId,
        completedAt: new Date(),
        notes: '',
      });

      if (result.success) {
        setCompletedToday(prev => ({ ...prev, [habitId]: true }));
        
        toast({
          title: "¡Excelente!",
          description: "Hábito completado correctamente",
          variant: "success"
        });

        // Gamificación: XP, racha y recompensa
        try {
          const habit = habits.find(h => h.id === habitId);
          const g = await updateUserGamification(user.uid, { addXp: XP_VALUES.completeHabit, completedAt: new Date() });
          const reward = generateRewardForHabit(habit?.category || 'General');
          await grantReward(user.uid, reward);
          toast({ title: `${reward.icon} Recompensa`, description: `${reward.name} (${reward.rarity})`, variant: 'success' });
          // Retos: actualizar progreso/descanso
          await updateChallengesOnHabitCompletion(user.uid, habit, new Date());
        } catch {}

        // Verificar logros
        const habitsResult = await getHabits(user.uid);
        const logsResult = await getHabitLogs(user.uid);
        const achievementsResult = await getAchievements(user.uid);

        if (habitsResult.success && logsResult.success && achievementsResult.success) {
          const newAchievements = await checkAchievements(
            user.uid,
            habitsResult.data,
            logsResult.data,
            achievementsResult.data,
            async (userId, achievement) => {
              const result = await createAchievement(userId, achievement);
              if (result.success) {
                toast({
                  title: `🏆 ¡Logro Desbloqueado!`,
                  description: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
                  variant: "success"
                });
              }
              return result;
            }
          );
          await checkCategoryAchievements(
            user.uid,
            habitsResult.data,
            logsResult.data,
            achievementsResult.data,
            async (userId, achievement) => {
              const result = await createAchievement(userId, achievement);
              if (result.success) {
                toast({ title: `🏆 ¡Logro Desbloqueado!`, description: `${achievement.icon} ${achievement.name}`, variant: 'success' });
              }
              return result;
            }
          );
        }
      } else {
        toast({
          title: "Error",
          description: "No se pudo marcar el hábito",
          variant: "destructive"
        });
      }
    }

    setProcessingHabit(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hábitos de Hoy</CardTitle>
          <CardDescription>Completa tus hábitos diarios</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </CardContent>
      </Card>
    );
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hábitos de Hoy</CardTitle>
          <CardDescription>Completa tus hábitos diarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tienes hábitos creados aún</p>
            <p className="text-sm text-gray-400">
              Ve a la sección de Hábitos para crear tu primer hábito
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-white text-lg sm:text-xl">Hábitos de Hoy</CardTitle>
        <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
          {Object.values(completedToday).filter(Boolean).length} de {habits.length} completados
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                id={habit.id}
                checked={completedToday[habit.id] || false}
                onCheckedChange={(checked) => handleCheckHabit(habit.id, checked)}
                disabled={processingHabit === habit.id || completedToday[habit.id]}
              />
              <label
                htmlFor={habit.id}
                className={`flex-1 cursor-pointer ${
                  completedToday[habit.id] ? 'line-through text-gray-400' : ''
                }`}
              >
                <div className="font-medium">{habit.name}</div>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                    CATEGORY_COLORS[habit.category] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {habit.category}
                </span>
              </label>
              {processingHabit === habit.id && (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

