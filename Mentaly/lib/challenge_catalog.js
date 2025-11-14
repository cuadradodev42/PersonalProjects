import { AREA_LABELS } from './areas';

// Genera retos creativos y llamativos por categoría
export function generateChallenges() {
  const challenges = [];
  
  const challengeTemplates = {
    'Salud Física': [
      { name: '🏃‍♂️ Maratón Semanal', description: 'Completa 10 hábitos de salud física en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '💪 Desafío Titanio', description: 'Completa 20 hábitos de salud física en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '🔥 Racha de Fuego', description: 'Mantén una racha de 3 días en salud física', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '⚡ Rayo de Energía', description: 'Mantén una racha de 7 días en salud física', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '🏆 Maestro del Bienestar', description: 'Completa 50 hábitos de salud física en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ],
    'Salud Mental': [
      { name: '🧘‍♀️ Zen Semanal', description: 'Completa 10 hábitos de salud mental en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '🌟 Iluminación Interior', description: 'Completa 20 hábitos de salud mental en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '🌊 Onda de Calma', description: 'Mantén una racha de 3 días en salud mental', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '✨ Serenidad Eterna', description: 'Mantén una racha de 7 días en salud mental', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '🎭 Gurú de la Mente', description: 'Completa 50 hábitos de salud mental en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ],
    'Finanzas': [
      { name: '💰 Semana Dorada', description: 'Completa 10 hábitos financieros en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '💎 Diamante Financiero', description: 'Completa 20 hábitos financieros en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '📈 Ascenso Constante', description: 'Mantén una racha de 3 días en finanzas', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '🏦 Banco de Hábitos', description: 'Mantén una racha de 7 días en finanzas', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '👑 Rey de las Finanzas', description: 'Completa 50 hábitos financieros en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ],
    'Carrera/Estudios': [
      { name: '🎓 Semana Académica', description: 'Completa 10 hábitos de carrera/estudios en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '🚀 Cohete Profesional', description: 'Completa 20 hábitos de carrera/estudios en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '📚 Biblioteca Viviente', description: 'Mantén una racha de 3 días en carrera/estudios', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '🎯 Objetivo Cumplido', description: 'Mantén una racha de 7 días en carrera/estudios', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '🏅 Genio del Conocimiento', description: 'Completa 50 hábitos de carrera/estudios en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ],
    'Relaciones Familiares': [
      { name: '👨‍👩‍👧‍👦 Semana Familiar', description: 'Completa 10 hábitos familiares en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '💝 Lazos de Amor', description: 'Completa 20 hábitos familiares en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '🤗 Abrazo Constante', description: 'Mantén una racha de 3 días en relaciones familiares', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '❤️ Corazón Familiar', description: 'Mantén una racha de 7 días en relaciones familiares', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '👑 Patriarca/Matriarca', description: 'Completa 50 hábitos familiares en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ],
    'Relaciones Sociales': [
      { name: '🎉 Semana Social', description: 'Completa 10 hábitos sociales en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '🌟 Estrella Social', description: 'Completa 20 hábitos sociales en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '🤝 Mano Amiga', description: 'Mantén una racha de 3 días en relaciones sociales', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '🎭 Alma de la Fiesta', description: 'Mantén una racha de 7 días en relaciones sociales', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '👑 Rey/Reina Social', description: 'Completa 50 hábitos sociales en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ],
    'Desarrollo Personal': [
      { name: '🌱 Semana de Crecimiento', description: 'Completa 10 hábitos de desarrollo personal en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '🦋 Metamorfosis', description: 'Completa 20 hábitos de desarrollo personal en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '🌅 Amanecer Personal', description: 'Mantén una racha de 3 días en desarrollo personal', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '🌅 Sol de la Mañana', description: 'Mantén una racha de 7 días en desarrollo personal', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '🏆 Maestro de la Vida', description: 'Completa 50 hábitos de desarrollo personal en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ],
    'Ocio/Diversión': [
      { name: '🎨 Semana Creativa', description: 'Completa 10 hábitos de ocio/diversión en 7 días', target: 10, windowDays: 7, rarity: 'rare' },
      { name: '🌈 Arcoíris de Diversión', description: 'Completa 20 hábitos de ocio/diversión en 14 días', target: 20, windowDays: 14, rarity: 'epic' },
      { name: '🎪 Circo Personal', description: 'Mantén una racha de 3 días en ocio/diversión', target: 3, windowDays: 3, rarity: 'rare' },
      { name: '🎭 Teatro de la Vida', description: 'Mantén una racha de 7 días en ocio/diversión', target: 7, windowDays: 7, rarity: 'epic' },
      { name: '🎪 Maestro del Entretenimiento', description: 'Completa 50 hábitos de ocio/diversión en 30 días', target: 50, windowDays: 30, rarity: 'legendary' }
    ]
  };

  AREA_LABELS.forEach(label => {
    const baseId = label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const templates = challengeTemplates[label] || challengeTemplates['Salud Física'];
    
    templates.forEach((template, index) => {
      challenges.push({
        id: `${baseId}_challenge_${index + 1}`,
        name: template.name,
        description: template.description,
        category: label,
        type: template.name.includes('Racha') ? 'streak_days' : 'complete_in_window',
        target: template.target,
        windowDays: template.windowDays,
        reward: { rarity: template.rarity },
        demanding: template.rarity === 'epic' || template.rarity === 'legendary',
        restDays: template.rarity === 'epic' ? 2 : template.rarity === 'legendary' ? 3 : 0
      });
    });
  });
  
  return challenges;
}

export const CHALLENGE_CATALOG = generateChallenges();


