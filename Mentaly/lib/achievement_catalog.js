import { AREA_LABELS } from './areas';

// Logros creativos y motivadores por categoría
export function generateAchievements() {
  const items = [];
  
  const achievementTemplates = {
    'Salud Física': [
      { name: '🌱 Semilla de Vitalidad', description: 'Tu primer paso hacia una vida más saludable', icon: '🌱', rarity: 'common' },
      { name: '💪 Guerrero del Bienestar', description: '10 hábitos de salud física completados', icon: '💪', rarity: 'common' },
      { name: '🔥 Llama de la Energía', description: 'Racha de 3 días en salud física', icon: '🔥', rarity: 'rare' },
      { name: '🏆 Campeón de la Salud', description: '50 hábitos de salud física completados', icon: '🏆', rarity: 'epic' }
    ],
    'Salud Mental': [
      { name: '🧘‍♀️ Primer Suspiro', description: 'Tu primer momento de paz mental', icon: '🧘‍♀️', rarity: 'common' },
      { name: '🌟 Luz Interior', description: '10 hábitos de salud mental completados', icon: '🌟', rarity: 'common' },
      { name: '🌊 Ola de Serenidad', description: 'Racha de 3 días en salud mental', icon: '🌊', rarity: 'rare' },
      { name: '🎭 Maestro de la Mente', description: '50 hábitos de salud mental completados', icon: '🎭', rarity: 'epic' }
    ],
    'Finanzas': [
      { name: '💰 Primera Moneda', description: 'Tu primer paso hacia la libertad financiera', icon: '💰', rarity: 'common' },
      { name: '💎 Diamante en Bruto', description: '10 hábitos financieros completados', icon: '💎', rarity: 'common' },
      { name: '📈 Ascenso Dorado', description: 'Racha de 3 días en finanzas', icon: '📈', rarity: 'rare' },
      { name: '👑 Rey/Reina del Dinero', description: '50 hábitos financieros completados', icon: '👑', rarity: 'epic' }
    ],
    'Carrera/Estudios': [
      { name: '📚 Primera Página', description: 'Tu primer paso en el camino del conocimiento', icon: '📚', rarity: 'common' },
      { name: '🎓 Estudiante Dedicado', description: '10 hábitos de carrera/estudios completados', icon: '🎓', rarity: 'common' },
      { name: '🚀 Cohete del Saber', description: 'Racha de 3 días en carrera/estudios', icon: '🚀', rarity: 'rare' },
      { name: '🏅 Genio Absoluto', description: '50 hábitos de carrera/estudios completados', icon: '🏅', rarity: 'epic' }
    ],
    'Relaciones Familiares': [
      { name: '👨‍👩‍👧‍👦 Primer Abrazo', description: 'Tu primer momento especial en familia', icon: '👨‍👩‍👧‍👦', rarity: 'common' },
      { name: '💝 Corazón Familiar', description: '10 hábitos familiares completados', icon: '💝', rarity: 'common' },
      { name: '🤗 Cadena de Amor', description: 'Racha de 3 días en relaciones familiares', icon: '🤗', rarity: 'rare' },
      { name: '❤️ Patriarca/Matriarca', description: '50 hábitos familiares completados', icon: '❤️', rarity: 'epic' }
    ],
    'Relaciones Sociales': [
      { name: '🤝 Primera Conexión', description: 'Tu primer paso hacia nuevas amistades', icon: '🤝', rarity: 'common' },
      { name: '🌟 Estrella Social', description: '10 hábitos sociales completados', icon: '🌟', rarity: 'common' },
      { name: '🎉 Fiesta Continua', description: 'Racha de 3 días en relaciones sociales', icon: '🎉', rarity: 'rare' },
      { name: '👑 Rey/Reina de la Fiesta', description: '50 hábitos sociales completados', icon: '👑', rarity: 'epic' }
    ],
    'Desarrollo Personal': [
      { name: '🌱 Semilla del Cambio', description: 'Tu primer paso hacia una mejor versión de ti', icon: '🌱', rarity: 'common' },
      { name: '🦋 Mariposa Emergente', description: '10 hábitos de desarrollo personal completados', icon: '🦋', rarity: 'common' },
      { name: '🌅 Amanecer Personal', description: 'Racha de 3 días en desarrollo personal', icon: '🌅', rarity: 'rare' },
      { name: '🏆 Maestro de la Vida', description: '50 hábitos de desarrollo personal completados', icon: '🏆', rarity: 'epic' }
    ],
    'Ocio/Diversión': [
      { name: '🎨 Primera Pincelada', description: 'Tu primer momento de creatividad y diversión', icon: '🎨', rarity: 'common' },
      { name: '🌈 Arcoíris Personal', description: '10 hábitos de ocio/diversión completados', icon: '🌈', rarity: 'common' },
      { name: '🎪 Circo de la Alegría', description: 'Racha de 3 días en ocio/diversión', icon: '🎪', rarity: 'rare' },
      { name: '🎭 Maestro del Entretenimiento', description: '50 hábitos de ocio/diversión completados', icon: '🎭', rarity: 'epic' }
    ]
  };

  AREA_LABELS.forEach(label => {
    const base = label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const templates = achievementTemplates[label] || achievementTemplates['Salud Física'];
    
    templates.forEach((template, index) => {
      items.push({
        id: `${base}_achievement_${index + 1}`,
        name: template.name,
        description: template.description,
        icon: template.icon,
        rarity: template.rarity,
        category: label,
        condition: index === 0 ? { type: 'first_in_category' } : 
                   index === 1 ? { type: 'count_in_category', target: 10 } :
                   index === 2 ? { type: 'streak_in_category', target: 3 } :
                   { type: 'count_in_category', target: 50 }
      });
    });
  });
  
  // Logros globales épicos
  items.push(
    { id: 'global_first_step', name: '🌟 Primer Paso', description: 'Completa tu primer hábito en Mentaly', icon: '🌟', rarity: 'common', category: null, condition: { type: 'global_count', target: 1 } },
    { id: 'global_rising_star', name: '⭐ Estrella Naciente', description: 'Completa 5 hábitos en total', icon: '⭐', rarity: 'common', category: null, condition: { type: 'global_count', target: 5 } },
    { id: 'global_dedicated', name: '💫 Dedicado', description: 'Completa 10 hábitos en total', icon: '💫', rarity: 'rare', category: null, condition: { type: 'global_count', target: 10 } },
    { id: 'global_warrior', name: '🔥 Guerrero de Hábitos', description: 'Completa 25 hábitos en total', icon: '🔥', rarity: 'rare', category: null, condition: { type: 'global_count', target: 25 } },
    { id: 'global_champion', name: '🏆 Campeón Absoluto', description: 'Completa 50 hábitos en total', icon: '🏆', rarity: 'epic', category: null, condition: { type: 'global_count', target: 50 } },
    { id: 'global_streak_3', name: '📅 Racha de Bronce', description: 'Completa hábitos 3 días seguidos', icon: '📅', rarity: 'rare', category: null, condition: { type: 'global_streak', target: 3 } },
    { id: 'global_streak_7', name: '🔥 Racha de Fuego', description: 'Completa hábitos 7 días seguidos', icon: '🔥', rarity: 'epic', category: null, condition: { type: 'global_streak', target: 7 } },
    { id: 'global_week_power', name: '⚡ Semana de Poder', description: 'Completa 30 hábitos en 7 días', icon: '⚡', rarity: 'epic', category: null, condition: { type: 'global_in_window', target: 30, windowDays: 7 } },
    { id: 'global_balance', name: '🎯 Equilibrio Perfecto', description: 'Activa un hábito en 5 áreas diferentes', icon: '🎯', rarity: 'rare', category: null, condition: { type: 'areas_covered', target: 5 } },
    { id: 'global_explorer', name: '🧭 Explorador Universal', description: 'Activa un hábito en todas las áreas', icon: '🧭', rarity: 'legendary', category: null, condition: { type: 'areas_covered', target: AREA_LABELS.length } },
    { id: 'global_legend', name: '👑 Leyenda Viviente', description: 'Completa 100 hábitos en total', icon: '👑', rarity: 'legendary', category: null, condition: { type: 'global_count', target: 100 } },
    { id: 'global_master', name: '🎭 Maestro de la Transformación', description: 'Completa hábitos 30 días seguidos', icon: '🎭', rarity: 'legendary', category: null, condition: { type: 'global_streak', target: 30 } }
  );
  
  return items;
}

export const ACHIEVEMENT_CATALOG = generateAchievements();


