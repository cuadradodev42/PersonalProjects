import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  setDoc 
} from 'firebase/firestore';
import { db } from './firebase';
import { AREA_LABELS } from './areas';

// ========== USUARIOS ==========

export async function createUserProfile(userId, data) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
}

export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
}

// ========== HÁBITOS ==========

export async function createHabit(userId, habitData) {
  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    const docRef = await addDoc(habitsRef, {
      name: habitData.name,
      category: habitData.category,
      frequency: habitData.frequency || 'daily',
      catalogId: habitData.catalogId || null,
      active: habitData.active !== undefined ? habitData.active : true,
      weeklyTarget: habitData.weeklyTarget || 5,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating habit:', error);
    return { success: false, error };
  }
}

export async function getHabits(userId) {
  try {
    const habitsRef = collection(db, 'users', userId, 'habits');
    const q = query(habitsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const habits = [];
    querySnapshot.forEach((doc) => {
      habits.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: habits };
  } catch (error) {
    console.error('Error getting habits:', error);
    return { success: false, error };
  }
}

export async function getHabit(userId, habitId) {
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    const habitSnap = await getDoc(habitRef);
    
    if (habitSnap.exists()) {
      return { success: true, data: { id: habitSnap.id, ...habitSnap.data() } };
    }
    return { success: false, error: 'Habit not found' };
  } catch (error) {
    console.error('Error getting habit:', error);
    return { success: false, error };
  }
}

export async function updateHabit(userId, habitId, habitData) {
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    await updateDoc(habitRef, habitData);
    return { success: true };
  } catch (error) {
    console.error('Error updating habit:', error);
    return { success: false, error };
  }
}

export async function deleteHabit(userId, habitId) {
  try {
    const habitRef = doc(db, 'users', userId, 'habits', habitId);
    await deleteDoc(habitRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting habit:', error);
    return { success: false, error };
  }
}

// ========== REGISTROS DE HÁBITOS (HABIT LOGS) ==========

export async function createHabitLog(userId, logData) {
  try {
    const logsRef = collection(db, 'users', userId, 'habit_logs');
    const docRef = await addDoc(logsRef, {
      ...logData,
      completedAt: logData.completedAt || Timestamp.fromDate(new Date()),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating habit log:', error);
    return { success: false, error };
  }
}

export async function getHabitLogs(userId, habitId = null, startDate = null, endDate = null) {
  try {
    let q = collection(db, 'users', userId, 'habit_logs');
    
    const constraints = [];
    
    if (habitId) {
      constraints.push(where('habitId', '==', habitId));
    }
    
    if (startDate) {
      constraints.push(where('completedAt', '>=', Timestamp.fromDate(startDate)));
    }
    
    if (endDate) {
      constraints.push(where('completedAt', '<=', Timestamp.fromDate(endDate)));
    }
    
    constraints.push(orderBy('completedAt', 'desc'));
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error getting habit logs:', error);
    return { success: false, error };
  }
}

export async function deleteHabitLog(userId, logId) {
  try {
    const logRef = doc(db, 'users', userId, 'habit_logs', logId);
    await deleteDoc(logRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting habit log:', error);
    return { success: false, error };
  }
}

// ========== RETOS (CHALLENGES) ==========

// Activar un reto desde catálogo
export async function activateChallenge(userId, challenge) {
  try {
    const ref = doc(db, 'users', userId, 'challenges_active', challenge.id);
    const snap = await getDoc(ref);
    if (snap.exists()) return { success: true, id: challenge.id, skipped: true };
    // Lock por categoría: impedir activar si hay descanso vigente
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const locks = userSnap.data().restLocks || {};
      const lockTs = locks[challenge.category];
      if (lockTs) {
        const until = lockTs.toDate ? lockTs.toDate() : new Date(lockTs);
        if (until > new Date()) {
          return { success: false, error: `Descanso activo en ${challenge.category} hasta ${until.toLocaleDateString()}` };
        }
      }
    }
    await setDoc(ref, {
      id: challenge.id,
      name: challenge.name,
      category: challenge.category,
      type: challenge.type,
      target: challenge.target,
      windowDays: challenge.windowDays || null,
      reward: challenge.reward || null,
      demanding: !!challenge.demanding,
      restDays: challenge.restDays || 0,
      progressCount: 0,
      streakCurrent: 0,
      startedAt: serverTimestamp(),
      completedAt: null,
    });
    return { success: true, id: challenge.id };
  } catch (error) {
    console.error('Error activating challenge:', error);
    return { success: false, error };
  }
}

export async function getActiveChallenges(userId) {
  try {
    const ref = collection(db, 'users', userId, 'challenges_active');
    const q = query(ref, orderBy('startedAt', 'desc'));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    return { success: true, data: items };
  } catch (error) {
    console.error('Error getting active challenges:', error);
    return { success: false, error };
  }
}

// Actualizar progreso de retos al completar un hábito
export async function updateChallengesOnHabitCompletion(userId, habit, completedAt = new Date()) {
  try {
    const active = await getActiveChallenges(userId);
    if (!active.success) return active;
    for (const ch of active.data) {
      if (ch.category && habit.category !== ch.category) continue;
      const ref = doc(db, 'users', userId, 'challenges_active', ch.id);
      // Ventanas de tiempo: opcional (simplificado en MVP)
      let progressCount = (ch.progressCount || 0) + 1;
      let streakCurrent = ch.streakCurrent || 0;
      // streak: si es día consecutivo
      const lastRef = doc(db, 'users', userId);
      // Nota: para simplificar, usamos streak del usuario como referencia diaria global
      // (ya se actualiza en gamification)
      if (ch.type === 'streak_days') {
        streakCurrent += 1;
      }
      const done = (ch.type === 'complete_in_window' && progressCount >= ch.target) || (ch.type === 'streak_days' && streakCurrent >= ch.target);
      await updateDoc(ref, {
        progressCount,
        streakCurrent,
        completedAt: done ? serverTimestamp() : null,
      });
      if (done && ch.demanding && ch.restDays > 0) {
        const userRef = doc(db, 'users', userId);
        const until = new Date(completedAt);
        until.setDate(until.getDate() + ch.restDays);
        await updateDoc(userRef, {
          [`restLocks.${ch.category}`]: until,
          updatedAt: serverTimestamp(),
        });
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating challenges:', error);
    return { success: false, error };
  }
}

// ========== SNAPSHOTS SEMANALES (RUEDA DE LA VIDA) ==========

function getWeekStartISO(date = new Date()) {
  // Obtener lunes de la semana (consideramos semana que inicia en lunes)
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7; // 1..7
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  // Normalizar a 00:00:00 UTC
  d.setUTCHours(0, 0, 0, 0);
  // Formato YYYY-MM-DD
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const da = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

export async function upsertLifeWheelWeeklySnapshot(userId, baseScoresMap, importanceMap = {}, useWeighted = true) {
  try {
    const weekKey = getWeekStartISO(new Date());
    const snapRef = doc(db, 'users', userId, 'life_wheel_snapshots', weekKey);
    const snap = await getDoc(snapRef);
    if (snap.exists()) {
      return { success: true, skipped: true };
    }

    // Calcular ponderados a partir de baseScoresMap e importanceMap
    const weightedScores = {};
    Object.keys(baseScoresMap || {}).forEach(category => {
      const base = typeof baseScoresMap[category] === 'number' ? baseScoresMap[category] : 0;
      const importance = typeof importanceMap[category] === 'number' ? importanceMap[category] : 5;
      const weighted = Math.round(base * (importance / 10));
      weightedScores[category] = weighted;
    });

    const payload = {
      weekKey,
      createdAt: serverTimestamp(),
      baseScores: baseScoresMap || {},
      weightedScores,
      importance: importanceMap || {},
      settings: { useWeighted },
    };

    await setDoc(snapRef, payload);
    return { success: true, id: weekKey };
  } catch (error) {
    console.error('Error upserting life wheel weekly snapshot:', error);
    return { success: false, error };
  }
}

// Verificar si un hábito ya fue completado hoy
export async function isHabitCompletedToday(userId, habitId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const logsRef = collection(db, 'users', userId, 'habit_logs');
    // Para evitar requerir índice compuesto (habitId + completedAt),
    // consultamos por rango de fecha y filtramos en memoria por habitId
    const q = query(
      logsRef,
      where('completedAt', '>=', Timestamp.fromDate(today)),
      where('completedAt', '<', Timestamp.fromDate(tomorrow))
    );
    const querySnapshot = await getDocs(q);
    let found = false;
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.habitId === habitId) found = true;
    });
    return { success: true, completed: found };
  } catch (error) {
    console.error('Error checking if habit completed today:', error);
    return { success: false, error };
  }
}

// ========== LOGROS (ACHIEVEMENTS) ==========

export async function createAchievement(userId, achievementData) {
  try {
    const achievementsRef = collection(db, 'users', userId, 'achievements');
    const docRef = await addDoc(achievementsRef, {
      ...achievementData,
      unlockedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating achievement:', error);
    return { success: false, error };
  }
}

export async function getAchievements(userId) {
  try {
    const achievementsRef = collection(db, 'users', userId, 'achievements');
    const q = query(achievementsRef, orderBy('unlockedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const achievements = [];
    querySnapshot.forEach((doc) => {
      achievements.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: achievements };
  } catch (error) {
    console.error('Error getting achievements:', error);
    return { success: false, error };
  }
}

// ========== ESTADÍSTICAS ==========

// Obtener el conteo de hábitos completados por día
export async function getHabitsCompletedByDay(userId, days = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const logsRef = collection(db, 'users', userId, 'habit_logs');
    const q = query(
      logsRef,
      where('completedAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('completedAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: logs };
  } catch (error) {
    console.error('Error getting habits by day:', error);
    return { success: false, error };
  }
}

// Calcular el puntaje de la Rueda de la Vida
export async function calculateLifeWheelScores(userId, habits, days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const logsResult = await getHabitLogs(userId, null, startDate, new Date());
    
    if (!logsResult.success) {
      return { success: false, error: logsResult.error };
    }
    
    const logs = logsResult.data;
    
    const categories = AREA_LABELS;
    
    const scores = {};
    
    categories.forEach(category => {
      const categoryHabits = habits.filter(h => h.category === category);
      
      if (categoryHabits.length === 0) {
        scores[category] = 0;
        return;
      }
      
      const totalScheduled = categoryHabits.length * days;
      const completedLogs = logs.filter(log => 
        categoryHabits.some(h => h.id === log.habitId)
      );
      
      const completionRate = completedLogs.length / totalScheduled;
      scores[category] = Math.min(Math.round(completionRate * 10), 10);
    });
    
    return { success: true, data: scores };
  } catch (error) {
    console.error('Error calculating life wheel scores:', error);
    return { success: false, error };
  }
}

