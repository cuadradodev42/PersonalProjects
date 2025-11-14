// Definición centralizada de áreas de la Rueda de la Vida

export const AREAS = [
  { key: 'salud_fisica', label: 'Salud Física' },
  { key: 'salud_mental', label: 'Salud Mental' },
  { key: 'finanzas', label: 'Finanzas' },
  { key: 'carrera', label: 'Carrera/Estudios' },
  { key: 'familia', label: 'Relaciones Familiares' },
  { key: 'social', label: 'Relaciones Sociales' },
  { key: 'pareja', label: 'Relaciones de Pareja' },
  { key: 'desarrollo', label: 'Desarrollo Personal' },
  { key: 'espiritualidad', label: 'Espiritualidad' },
  { key: 'contribucion', label: 'Contribución a la Sociedad' },
  { key: 'ocio', label: 'Ocio/Diversión' },
];

// Mapa de etiqueta -> clases de badge para UI
export const AREA_BADGE_CLASSES = {
  'Salud Física': 'bg-green-100 text-green-800',
  'Salud Mental': 'bg-blue-100 text-blue-800',
  'Finanzas': 'bg-yellow-100 text-yellow-800',
  'Carrera/Estudios': 'bg-purple-100 text-purple-800',
  'Relaciones Familiares': 'bg-pink-100 text-pink-800',
  'Relaciones Sociales': 'bg-indigo-100 text-indigo-800',
  'Relaciones de Pareja': 'bg-rose-100 text-rose-800',
  'Desarrollo Personal': 'bg-orange-100 text-orange-800',
  'Espiritualidad': 'bg-emerald-100 text-emerald-800',
  'Contribución a la Sociedad': 'bg-cyan-100 text-cyan-800',
  'Ocio/Diversión': 'bg-teal-100 text-teal-800',
};

export const AREA_LABELS = AREAS.map(a => a.label);


