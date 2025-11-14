# Ejemplos de Uso - Mentaly API

Este documento muestra cómo usar las funciones de Firestore implementadas en la aplicación.

## 📚 Importar Funciones

```javascript
import {
  // Hábitos
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
  
  // Registros de Hábitos
  createHabitLog,
  getHabitLogs,
  deleteHabitLog,
  isHabitCompletedToday,
  
  // Logros
  createAchievement,
  getAchievements,
  
  // Estadísticas
  getHabitsCompletedByDay,
  calculateLifeWheelScores,
} from '@/lib/firestore';
```

## 🎯 Hábitos

### Crear un nuevo hábito

```javascript
const handleCreateHabit = async () => {
  const result = await createHabit(user.uid, {
    name: 'Meditar 10 minutos',
    category: 'Salud Mental',
    frequency: 'daily',
  });
  
  if (result.success) {
    console.log('Hábito creado con ID:', result.id);
  } else {
    console.error('Error:', result.error);
  }
};
```

### Obtener todos los hábitos

```javascript
const loadHabits = async () => {
  const result = await getHabits(user.uid);
  
  if (result.success) {
    const habits = result.data;
    console.log('Hábitos:', habits);
    // habits es un array de objetos con estructura:
    // [{ id, name, category, frequency, createdAt }]
  }
};
```

### Obtener un hábito específico

```javascript
const loadHabit = async (habitId) => {
  const result = await getHabit(user.uid, habitId);
  
  if (result.success) {
    const habit = result.data;
    console.log('Hábito:', habit);
  }
};
```

### Actualizar un hábito

```javascript
const handleUpdateHabit = async (habitId) => {
  const result = await updateHabit(user.uid, habitId, {
    name: 'Meditar 20 minutos',
    category: 'Salud Mental',
  });
  
  if (result.success) {
    console.log('Hábito actualizado');
  }
};
```

### Eliminar un hábito

```javascript
const handleDeleteHabit = async (habitId) => {
  const result = await deleteHabit(user.uid, habitId);
  
  if (result.success) {
    console.log('Hábito eliminado');
  }
};
```

## 📝 Registros de Hábitos (Habit Logs)

### Registrar un hábito completado

```javascript
const handleCompleteHabit = async (habitId) => {
  const result = await createHabitLog(user.uid, {
    habitId: habitId,
    completedAt: new Date(),
    notes: 'Me sentí muy bien después de meditar',
  });
  
  if (result.success) {
    console.log('Hábito registrado como completado');
  }
};
```

### Obtener todos los logs

```javascript
const loadAllLogs = async () => {
  const result = await getHabitLogs(user.uid);
  
  if (result.success) {
    const logs = result.data;
    console.log('Total de hábitos completados:', logs.length);
  }
};
```

### Obtener logs de un hábito específico

```javascript
const loadHabitLogs = async (habitId) => {
  const result = await getHabitLogs(user.uid, habitId);
  
  if (result.success) {
    const logs = result.data;
    console.log('Logs del hábito:', logs);
  }
};
```

### Obtener logs en un rango de fechas

```javascript
const loadLogsInRange = async () => {
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-01-31');
  
  const result = await getHabitLogs(user.uid, null, startDate, endDate);
  
  if (result.success) {
    const logs = result.data;
    console.log('Logs de enero:', logs);
  }
};
```

### Verificar si un hábito fue completado hoy

```javascript
const checkIfCompleted = async (habitId) => {
  const result = await isHabitCompletedToday(user.uid, habitId);
  
  if (result.success) {
    if (result.completed) {
      console.log('Este hábito ya fue completado hoy');
    } else {
      console.log('Este hábito aún no se ha completado hoy');
    }
  }
};
```

### Eliminar un log

```javascript
const handleDeleteLog = async (logId) => {
  const result = await deleteHabitLog(user.uid, logId);
  
  if (result.success) {
    console.log('Log eliminado');
  }
};
```

## 🏆 Logros

### Crear un logro

```javascript
const handleUnlockAchievement = async () => {
  const result = await createAchievement(user.uid, {
    name: 'Principiante',
    description: 'Completaste tu primer hábito',
    rarity: 'common',
    icon: '🌱',
  });
  
  if (result.success) {
    console.log('Logro desbloqueado:', result.id);
  }
};
```

### Obtener todos los logros

```javascript
const loadAchievements = async () => {
  const result = await getAchievements(user.uid);
  
  if (result.success) {
    const achievements = result.data;
    console.log('Logros desbloqueados:', achievements.length);
  }
};
```

### Sistema automático de logros

```javascript
import { checkAchievements } from '@/lib/utils';

const checkAndUnlockAchievements = async () => {
  // Obtener datos necesarios
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
        return await createAchievement(userId, achievement);
      }
    );
    
    console.log('Nuevos logros desbloqueados:', newAchievements.length);
  }
};
```

## 📊 Estadísticas

### Obtener hábitos completados por día

```javascript
const loadWeeklyStats = async () => {
  const result = await getHabitsCompletedByDay(user.uid, 7);
  
  if (result.success) {
    const logs = result.data;
    
    // Agrupar por día
    const logsByDay = {};
    logs.forEach(log => {
      const date = log.completedAt.toDate();
      const dateKey = date.toISOString().split('T')[0];
      
      if (!logsByDay[dateKey]) {
        logsByDay[dateKey] = [];
      }
      logsByDay[dateKey].push(log);
    });
    
    console.log('Logs agrupados por día:', logsByDay);
  }
};
```

### Calcular puntajes de la Rueda de la Vida

```javascript
const loadLifeWheelScores = async () => {
  const habitsResult = await getHabits(user.uid);
  
  if (habitsResult.success) {
    const result = await calculateLifeWheelScores(
      user.uid,
      habitsResult.data,
      30 // últimos 30 días
    );
    
    if (result.success) {
      const scores = result.data;
      console.log('Puntajes por categoría:', scores);
      // Ejemplo de output:
      // {
      //   "Salud Física": 7,
      //   "Salud Mental": 5,
      //   "Finanzas": 3,
      //   ...
      // }
    }
  }
};
```

## 🛠️ Utilidades

### Formatear fechas

```javascript
import { formatDate } from '@/lib/utils';

const date = new Date('2025-01-15');
console.log(formatDate(date)); // "15 ene 2025"
```

### Obtener fecha de hoy sin hora

```javascript
import { getTodayDate } from '@/lib/utils';

const today = getTodayDate();
console.log(today); // Date object con hora 00:00:00
```

### Comparar si dos fechas son el mismo día

```javascript
import { isSameDay } from '@/lib/utils';

const date1 = new Date('2025-01-15 10:30:00');
const date2 = new Date('2025-01-15 18:45:00');

console.log(isSameDay(date1, date2)); // true
```

### Obtener últimos N días

```javascript
import { getLastNDays } from '@/lib/utils';

const last7Days = getLastNDays(7);
console.log(last7Days); // Array de 7 objetos Date
```

## 📱 Componentes Personalizados

### Usar el Toast

```javascript
import { toast } from '@/components/ui/use-toast';

const showSuccessToast = () => {
  toast({
    title: "¡Éxito!",
    description: "Operación completada correctamente",
    variant: "success"
  });
};

const showErrorToast = () => {
  toast({
    title: "Error",
    description: "Algo salió mal",
    variant: "destructive"
  });
};
```

### Usar Modal

```javascript
import { useState } from 'react';
import Modal from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mi Modal"
        description="Este es un ejemplo"
      >
        <p>Contenido del modal aquí</p>
      </Modal>
    </>
  );
}
```

## 🔐 Autenticación

### Usar el contexto de autenticación

```javascript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, loading, login, signup, loginWithGoogle, logout } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!user) {
    return <div>No hay usuario</div>;
  }
  
  return (
    <div>
      <p>Usuario: {user.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

## 📈 Ejemplo Completo: Dashboard Personalizado

```javascript
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getHabits, getHabitLogs, calculateLifeWheelScores } from '@/lib/firestore';

export default function CustomDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    lifeWheelScores: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);

    // Obtener hábitos
    const habitsResult = await getHabits(user.uid);
    const habits = habitsResult.success ? habitsResult.data : [];

    // Obtener logs de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logsResult = await getHabitLogs(user.uid, null, today, tomorrow);
    const todayLogs = logsResult.success ? logsResult.data : [];

    // Calcular puntajes de la Rueda de la Vida
    const scoresResult = await calculateLifeWheelScores(user.uid, habits, 30);
    const scores = scoresResult.success ? scoresResult.data : {};

    setStats({
      totalHabits: habits.length,
      completedToday: todayLogs.length,
      lifeWheelScores: scores,
    });

    setLoading(false);
  };

  if (loading) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mi Dashboard Personalizado</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.totalHabits}</div>
          <div className="text-gray-600">Total de Hábitos</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold">{stats.completedToday}</div>
          <div className="text-gray-600">Completados Hoy</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="text-2xl font-bold">
            {stats.totalHabits > 0 
              ? Math.round((stats.completedToday / stats.totalHabits) * 100)
              : 0}%
          </div>
          <div className="text-gray-600">Progreso del Día</div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Puntajes de la Rueda de la Vida</h2>
        <div className="space-y-2">
          {Object.entries(stats.lifeWheelScores).map(([category, score]) => (
            <div key={category} className="flex items-center justify-between">
              <span>{category}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
                <span className="font-bold">{score}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

**¿Tienes preguntas?** Consulta la documentación completa en README.md

