import { AREA_LABELS } from './areas';
import { HABIT_CATALOG } from './habit_catalog';

// Plantillas básicas de hábitos por área (MVP)
const TEMPLATES = {
  'Salud Física': [
    'Caminar 30 minutos',
    'Beber 8 vasos de agua',
    'Dormir 7-8 horas',
    'Estiramientos 10 minutos',
  ],
  'Salud Mental': [
    'Meditación 10 minutos',
    'Escribir 3 gratitudes',
    'Respiración consciente 5 minutos',
  ],
  'Finanzas': [
    'Registrar gastos diarios',
    'Revisar presupuesto semanal',
    'Ahorrar una cantidad fija',
  ],
  'Carrera/Estudios': [
    'Leer 20 minutos',
    'Aprender una habilidad 30 minutos',
    'Planificar el día laboral',
  ],
  'Relaciones Familiares': [
    'Llamar a un familiar',
    'Compartir una comida en familia',
  ],
  'Relaciones Sociales': [
    'Contactar a un amigo',
    'Participar en una actividad social',
  ],
  'Relaciones de Pareja': [
    'Planear una cita sencilla',
    'Expresar aprecio a tu pareja',
    'Conversación sin pantallas 15 minutos',
  ],
  'Desarrollo Personal': [
    'Diario 10 minutos',
    'Visualización de objetivos',
  ],
  'Espiritualidad': [
    'Reflexión/Oración 10 minutos',
    'Lectura espiritual 10 minutos',
  ],
  'Contribución a la Sociedad': [
    'Acto de amabilidad',
    'Voluntariado (planificar 1h/semana)',
  ],
  'Ocio/Diversión': [
    'Hobby 20 minutos',
    'Tiempo al aire libre',
  ],
};

export function suggestHabits({ areas = {}, currentHabits = [], snapshots = [] }) {
  // Detectar categorías prioritarias:
  // - Baja satisfacción (< 5)
  // - Alta importancia (> 7)
  // - Tendencia negativa: último snapshot ponderado < snapshot anterior ponderado
  const hasHabitInCategory = (label) => currentHabits.some(h => h.category === label);

  const last = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];

  const negativeTrendLabels = new Set();
  if (last && prev && last.weightedScores && prev.weightedScores) {
    AREA_LABELS.forEach(label => {
      const a = typeof last.weightedScores[label] === 'number' ? last.weightedScores[label] : null;
      const b = typeof prev.weightedScores[label] === 'number' ? prev.weightedScores[label] : null;
      if (a !== null && b !== null && a < b) negativeTrendLabels.add(label);
    });
  }

  const suggestions = [];

  AREA_LABELS.forEach(label => {
    const area = areas[label] || {};
    const satisfaction = typeof area.satisfaction === 'number' ? area.satisfaction : 5;
    const importance = typeof area.importance === 'number' ? area.importance : 5;

    const lowSatisfaction = satisfaction < 5;
    const highImportance = importance > 7;
    const negativeTrend = negativeTrendLabels.has(label);

    if ((lowSatisfaction && highImportance) || negativeTrend) {
      // Evitar duplicados si ya hay muchos hábitos en esa categoría (heurística simple)
      if (hasHabitInCategory(label) && !negativeTrend) return;

      // Buscar en catálogo hábitos de esa categoría
      const candidates = HABIT_CATALOG.filter(h => h.category === label).slice(0, 3);
      candidates.forEach(h => {
        suggestions.push({ name: h.name, category: h.category, catalogId: h.id, reason: buildReason({ lowSatisfaction, highImportance, negativeTrend }) });
      });
    }
  });

  return suggestions;
}

function buildReason({ lowSatisfaction, highImportance, negativeTrend }) {
  const reasons = [];
  if (lowSatisfaction) reasons.push('baja satisfacción');
  if (highImportance) reasons.push('alta importancia');
  if (negativeTrend) reasons.push('evolución negativa');
  return `Sugerido por ${reasons.join(', ')}`;
}


