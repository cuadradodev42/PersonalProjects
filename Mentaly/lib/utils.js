import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Función para formatear fechas
export function formatDate(date) {
  if (!date) return "";
  
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(d);
}

// Función para obtener la fecha de hoy sin hora
export function getTodayDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Función para comparar si dos fechas son el mismo día
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  
  const d1 = date1 instanceof Date ? date1 : date1.toDate ? date1.toDate() : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : date2.toDate ? date2.toDate() : new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// Función para obtener el rango de fechas de los últimos N días
export function getLastNDays(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
}

// Función para verificar logros
import { ACHIEVEMENT_CATALOG } from './achievement_catalog';

export async function checkAchievements(userId, habits, habitLogs, achievements, createAchievement) {
  const existingAchievementNames = achievements.map(a => a.name);
  const newAchievements = [];

  // Primer hábito completado
  if (habitLogs.length === 1 && !existingAchievementNames.includes("Primer Paso")) {
    newAchievements.push({
      name: "Primer Paso",
      description: "Completaste tu primer hábito",
      rarity: "common",
      icon: "🌱"
    });
  }

  // 5 hábitos completados en total
  if (habitLogs.length >= 5 && !existingAchievementNames.includes("Principiante Dedicado")) {
    newAchievements.push({
      name: "Principiante Dedicado",
      description: "Completaste 5 hábitos en total",
      rarity: "common",
      icon: "⭐"
    });
  }

  // 20 hábitos completados en total
  if (habitLogs.length >= 20 && !existingAchievementNames.includes("En Racha")) {
    newAchievements.push({
      name: "En Racha",
      description: "Completaste 20 hábitos en total",
      rarity: "rare",
      icon: "🔥"
    });
  }

  // 50 hábitos completados en total
  if (habitLogs.length >= 50 && !existingAchievementNames.includes("Campeón de Hábitos")) {
    newAchievements.push({
      name: "Campeón de Hábitos",
      description: "Completaste 50 hábitos en total",
      rarity: "epic",
      icon: "🏆"
    });
  }

  // Verificar hábitos de Salud Física
  const healthHabits = habits.filter(h => h.category === "Salud Física");
  const healthLogs = habitLogs.filter(log => 
    healthHabits.some(h => h.id === log.habitId)
  );
  
  if (healthLogs.length >= 5 && !existingAchievementNames.includes("Cuerpo Sano")) {
    newAchievements.push({
      name: "Cuerpo Sano",
      description: "Completaste 5 hábitos de Salud Física",
      rarity: "rare",
      icon: "💪"
    });
  }

  // Verificar racha de 3 días seguidos
  if (habitLogs.length >= 3) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const last3Days = [0, 1, 2].map(i => {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });

    const logsGroupedByDay = {};
    habitLogs.forEach(log => {
      const logDate = log.completedAt instanceof Date 
        ? log.completedAt 
        : log.completedAt.toDate 
          ? log.completedAt.toDate() 
          : new Date(log.completedAt);
      const dateKey = logDate.toISOString().split('T')[0];
      if (!logsGroupedByDay[dateKey]) {
        logsGroupedByDay[dateKey] = [];
      }
      logsGroupedByDay[dateKey].push(log);
    });

    const hasLogsInLast3Days = last3Days.every(day => logsGroupedByDay[day] && logsGroupedByDay[day].length > 0);
    
    if (hasLogsInLast3Days && !existingAchievementNames.includes("Racha de 3 Días")) {
      newAchievements.push({
        name: "Racha de 3 Días",
        description: "Completaste hábitos 3 días seguidos",
        rarity: "rare",
        icon: "📅"
      });
    }
  }

  // Crear los logros en Firestore
  for (const achievement of newAchievements) {
    await createAchievement(userId, achievement);
  }

  return newAchievements;
}

// Evaluación adicional por catálogo por categoría
export async function checkCategoryAchievements(userId, habits, habitLogs, achievements, createAchievement) {
  const existing = new Set(achievements.map(a => a.name));
  const byCategory = (cat) => ({
    habits: habits.filter(h => h.category === cat),
    logs: habitLogs.filter(l => habits.some(h => h.id === l.habitId && h.category === cat)),
  });
  for (const item of ACHIEVEMENT_CATALOG) {
    if (existing.has(item.name)) continue;
    const { habits: ch, logs: cl } = item.category ? byCategory(item.category) : { habits, logs: habitLogs };
    if (item.condition.type === 'first_in_category' && cl.length >= 1) {
      await createAchievement(userId, item);
    }
    if (item.condition.type === 'count_in_category' && cl.length >= (item.condition.target || 10)) {
      await createAchievement(userId, item);
    }
    if (item.condition.type === 'streak_in_category') {
      const days = item.condition.target || 3;
      const today = getTodayDate();
      let ok = true;
      for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const has = cl.some(log => {
          const dt = log.completedAt.toDate ? log.completedAt.toDate() : new Date(log.completedAt);
          return dt.toISOString().split('T')[0] === key;
        });
        if (!has) { ok = false; break; }
      }
      if (ok) await createAchievement(userId, item);
    }
    if (item.condition.type === 'global_count' && habitLogs.length >= (item.condition.target || 1)) {
      await createAchievement(userId, item);
    }
    if (item.condition.type === 'global_streak') {
      const days = item.condition.target || 3;
      const today = getTodayDate();
      let ok = true;
      for (let i = 0; i < days; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const has = habitLogs.some(log => {
          const dt = log.completedAt.toDate ? log.completedAt.toDate() : new Date(log.completedAt);
          return dt.toISOString().split('T')[0] === key;
        });
        if (!has) { ok = false; break; }
      }
      if (ok) await createAchievement(userId, item);
    }
    if (item.condition.type === 'global_in_window') {
      const days = item.condition.windowDays || 7;
      const start = new Date();
      start.setDate(start.getDate() - days + 1);
      start.setHours(0,0,0,0);
      const count = habitLogs.filter(log => {
        const dt = log.completedAt.toDate ? log.completedAt.toDate() : new Date(log.completedAt);
        return dt >= start;
      }).length;
      if (count >= (item.condition.target || 30)) await createAchievement(userId, item);
    }
    if (item.condition.type === 'areas_covered') {
      const covered = new Set();
      habitLogs.forEach(log => {
        const h = habits.find(h => h.id === log.habitId);
        if (h?.category) covered.add(h.category);
      });
      if (covered.size >= (item.condition.target || 5)) await createAchievement(userId, item);
    }
  }
}

