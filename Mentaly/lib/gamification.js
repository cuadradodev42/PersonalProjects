import { doc, getDoc, setDoc, updateDoc, serverTimestamp, addDoc, collection, orderBy, query, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const RARITY = {
  common: 'common',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary',
};

export const RARITY_LABEL = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
};

// Probabilidades simples para MVP
export const RARITY_PROB = [
  { rarity: RARITY.common, p: 0.65 },
  { rarity: RARITY.rare, p: 0.22 },
  { rarity: RARITY.epic, p: 0.10 },
  { rarity: RARITY.legendary, p: 0.03 },
];

export const XP_VALUES = {
  completeHabit: 15,
  streakBonus: 5, // por mantener racha
  levelBase: 100, // XP por nivel
};

export function computeLevelFromXp(totalXp, levelBase = XP_VALUES.levelBase) {
  if (!totalXp || totalXp <= 0) return { level: 1, current: 0, needed: levelBase };
  let level = 1;
  let remaining = totalXp;
  while (remaining >= levelBase) {
    remaining -= levelBase;
    level += 1;
  }
  return { level, current: remaining, needed: levelBase };
}

export function rollRarity() {
  const r = Math.random();
  let acc = 0;
  for (const item of RARITY_PROB) {
    acc += item.p;
    if (r <= acc) return item.rarity;
  }
  return RARITY.common;
}

export function generateRewardForHabit(category) {
  const rarity = rollRarity();
  const icons = {
    common: '🎖️',
    rare: '💎',
    epic: '🌟',
    legendary: '👑',
  };
  const names = {
    common: 'Insignia de Esfuerzo',
    rare: 'Gema de Progreso',
    epic: 'Estrella de Excelencia',
    legendary: 'Corona del Hábito',
  };
  return {
    name: names[rarity],
    description: `Por completar un hábito de ${category}`,
    rarity,
    icon: icons[rarity],
  };
}

export async function getUserGamification(userId) {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return { xp: 0, level: 1, streakCount: 0, lastCompletedDate: null };
  const d = snap.data();
  return {
    xp: d.xp || 0,
    level: d.level || 1,
    streakCount: d.streakCount || 0,
    lastCompletedDate: d.lastCompletedDate || null,
  };
}

export function isNextDay(prevDate, now = new Date()) {
  if (!prevDate) return false;
  const prev = prevDate.toDate ? prevDate.toDate() : new Date(prevDate);
  const a = new Date(prev);
  const b = new Date(now);
  a.setHours(0,0,0,0);
  b.setHours(0,0,0,0);
  const diff = (b - a) / (1000*60*60*24);
  return diff === 1;
}

export function isSameDayDate(d1, d2) {
  const a = d1.toDate ? d1.toDate() : new Date(d1);
  const b = d2.toDate ? d2.toDate() : new Date(d2);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export async function updateUserGamification(userId, { addXp = 0, completedAt = new Date() } = {}) {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  let xp = 0, streakCount = 0, lastCompletedDate = null;
  let freezeTokens = 1; // MVP: 1 comodín por defecto
  if (snap.exists()) {
    const d = snap.data();
    xp = d.xp || 0;
    streakCount = d.streakCount || 0;
    lastCompletedDate = d.lastCompletedDate || null;
    freezeTokens = d.freezeTokens !== undefined ? d.freezeTokens : 1;
  }
  let bonus = 0;
  // Actualizar racha
  if (lastCompletedDate) {
    if (isSameDayDate(lastCompletedDate, completedAt)) {
      // misma fecha: no incrementa racha
    } else if (isNextDay(lastCompletedDate, completedAt)) {
      streakCount += 1;
      bonus += XP_VALUES.streakBonus;
    } else {
      // Perdiste la racha: intenta usar freeze si hay
      if (freezeTokens > 0) {
        // no incrementa, pero preserva la racha
        freezeTokens -= 1;
      } else {
        streakCount = 1;
      }
    }
  } else {
    streakCount = 1;
  }

  const totalXp = xp + addXp + bonus;
  const { level } = computeLevelFromXp(totalXp);

  await updateDoc(userRef, {
    xp: totalXp,
    level,
    streakCount,
    lastCompletedDate: completedAt,
    freezeTokens,
    updatedAt: serverTimestamp(),
  });

  return { xp: totalXp, level, streakCount, bonusXp: bonus };
}

export async function grantReward(userId, reward) {
  const rewardsRef = collection(db, 'users', userId, 'rewards');
  const docRef = await addDoc(rewardsRef, {
    ...reward,
    grantedAt: serverTimestamp(),
  });
  return { id: docRef.id };
}

export async function getRecentRewards(userId, max = 5) {
  const rewardsRef = collection(db, 'users', userId, 'rewards');
  const q = query(rewardsRef, orderBy('grantedAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  const items = [];
  snap.forEach(d => items.push({ id: d.id, ...d.data() }));
  return items;
}

// Usar un token de freeze manualmente para preservar racha
export async function useFreezeToken(userId) {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return { success: false, error: 'User not found' };
  const d = snap.data();
  const freezeTokens = d.freezeTokens ?? 0;
  if (freezeTokens <= 0) return { success: false, error: 'No freeze tokens available' };
  const today = new Date();
  await updateDoc(userRef, {
    freezeTokens: freezeTokens - 1,
    lastCompletedDate: today,
    updatedAt: serverTimestamp(),
  });
  return { success: true };
}


