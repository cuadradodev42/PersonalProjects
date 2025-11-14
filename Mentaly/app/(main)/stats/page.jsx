'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getHabits, getHabitsCompletedByDay, calculateLifeWheelScores, getHabitLogs, getUserProfile, upsertLifeWheelWeeklySnapshot } from '@/lib/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AREA_LABELS } from '@/lib/areas';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

const CATEGORIES = AREA_LABELS;

export default function StatsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);
  const [categoryTrendData, setCategoryTrendData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [totalHabits, setTotalHabits] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [useWeighted, setUseWeighted] = useState(true);
  const [importanceMap, setImportanceMap] = useState({});
  const [weeklySnapshots, setWeeklySnapshots] = useState([]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // cargar preferencia local
      try {
        const localVal = localStorage.getItem('lifeWheelUseWeighted');
        if (localVal !== null) setUseWeighted(localVal === 'true');
      } catch {}
      // cargar perfil (importancia y preferencia remota)
      (async () => {
        const profile = await getUserProfile(user.uid);
        if (profile.success) {
          const areas = profile.data?.areas || {};
          const map = {};
          Object.keys(areas).forEach(label => {
            map[label] = typeof areas[label]?.importance === 'number' ? areas[label].importance : 5;
          });
          setImportanceMap(map);
          const pref = profile.data?.settings?.lifeWheel?.useWeighted;
          if (typeof pref === 'boolean') setUseWeighted(pref);
          // cargar snapshots semanales
          const snapsRef = collection(db, 'users', user.uid, 'life_wheel_snapshots');
          const snapsQ = query(snapsRef, orderBy('weekKey', 'asc'));
          const snapsSnap = await getDocs(snapsQ);
          const snapshots = [];
          snapsSnap.forEach(d => snapshots.push({ id: d.id, ...d.data() }));
          setWeeklySnapshots(snapshots);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedCategory) {
      loadCategoryTrend();
    }
  }, [user, selectedCategory, useWeighted, importanceMap]);

  const loadStats = async () => {
    setLoading(true);

    // Obtener hábitos
    const habitsResult = await getHabits(user.uid);
    if (habitsResult.success) {
      setTotalHabits(habitsResult.data.length);
    }

    // Obtener logs de los últimos 7 días
    const logsResult = await getHabitsCompletedByDay(user.uid, 7);
    
    if (logsResult.success) {
      const logs = logsResult.data;
      setTotalCompleted(logs.length);

      // Preparar datos para el gráfico de barras
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last7Days.push(date);
      }

      const chartData = last7Days.map(date => {
        const dateStr = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
        const dateKey = date.toISOString().split('T')[0];
        
        const count = logs.filter(log => {
          const logDate = log.completedAt.toDate 
            ? log.completedAt.toDate() 
            : new Date(log.completedAt);
          const logDateKey = logDate.toISOString().split('T')[0];
          return logDateKey === dateKey;
        }).length;

        return {
          day: dateStr,
          completados: count,
        };
      });

      setWeeklyData(chartData);
    }

    setLoading(false);

    // Guardar snapshot semanal si hay datos de importancia disponibles
    try {
      const baseScoresResult = await calculateLifeWheelScores(user.uid, habitsResult.success ? habitsResult.data : [], 30);
      if (baseScoresResult.success) {
        await upsertLifeWheelWeeklySnapshot(
          user.uid,
          baseScoresResult.data,
          importanceMap,
          useWeighted
        );
      }
    } catch {}
  };

  const loadCategoryTrend = async () => {
    // Obtener hábitos
    const habitsResult = await getHabits(user.uid);
    if (!habitsResult.success) return;

    const habits = habitsResult.data;
    const categoryHabits = habits.filter(h => h.category === selectedCategory);

    if (categoryHabits.length === 0) {
      setCategoryTrendData([]);
      return;
    }

    // Obtener el puntaje de la categoría para las últimas 4 semanas
    const trendData = [];
    
    for (let week = 3; week >= 0; week--) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - (week * 7));
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);

      const logsResult = await getHabitLogs(user.uid, null, startDate, endDate);
      
      if (logsResult.success) {
        const logs = logsResult.data;
        const totalScheduled = categoryHabits.length * 30;
        const completedLogs = logs.filter(log => 
          categoryHabits.some(h => h.id === log.habitId)
        );
        
        const completionRate = completedLogs.length / totalScheduled;
        const baseScore = Math.min(Math.round(completionRate * 10), 10);
        let score = baseScore;
        if (useWeighted) {
          const importance = typeof importanceMap[selectedCategory] === 'number' ? importanceMap[selectedCategory] : 5;
          score = Math.round(baseScore * (importance / 10));
        }

        trendData.push({
          semana: week === 0 ? 'Actual' : `-${week}sem`,
          puntaje: score,
          baseValue: baseScore,
          importance: importanceMap[selectedCategory] ?? 5,
        });
      }
    }

    setCategoryTrendData(trendData);
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
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
        <p className="mt-2 text-gray-600">
          Visualiza tu progreso y evolución a lo largo del tiempo
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Hábitos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{totalHabits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completados (7 días)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalCompleted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Promedio Diario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {totalCompleted > 0 ? (totalCompleted / 7).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Última Semana */}
      <Card>
        <CardHeader>
          <CardTitle>Hábitos Completados por Día</CardTitle>
          <CardDescription>Últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="completados" 
                  fill="#6366f1" 
                  radius={[8, 8, 0, 0]}
                  name="Completados"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay datos para mostrar
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Línea - Evolución de Categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Categoría</CardTitle>
          <CardDescription>
            {useWeighted ? 'Puntaje ponderado por importancia (0–10)' : 'Puntaje base (0–10)'} de la categoría seleccionada
          </CardDescription>
          <div className="mt-4 max-w-xs">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
              <Checkbox
                id="weighted-stats"
                checked={useWeighted}
                onCheckedChange={async (v) => {
                  const val = !!v;
                  setUseWeighted(val);
                  try { localStorage.setItem('lifeWheelUseWeighted', String(val)); } catch {}
                  try {
                    if (user) {
                      const userRef = doc(db, 'users', user.uid);
                      await updateDoc(userRef, { 'settings.lifeWheel.useWeighted': val });
                    }
                  } catch {}
                }}
              />
              Ponderar por importancia
            </label>
          </div>
        </CardHeader>
        <CardContent>
          {categoryTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={categoryTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="semana" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name, props) => {
                    const { payload } = props;
                    if (useWeighted) {
                      return [
                        `${value} (base: ${payload.baseValue ?? '-'}, importancia: ${payload.importance ?? '-'})`,
                        'Puntaje'
                      ];
                    }
                    return [ `${value}`, 'Puntaje base' ];
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="puntaje" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 6 }}
                  activeDot={{ r: 8 }}
                  name={useWeighted ? 'Puntaje (Ponderado)' : 'Puntaje (Base)'}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay hábitos en esta categoría
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evolución Semanal (Snapshots) */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución Semanal (Snapshots)</CardTitle>
          <CardDescription>
            {useWeighted ? 'Puntaje ponderado semanal' : 'Puntaje base semanal'} por área
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weeklySnapshots.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklySnapshots.map(s => ({
                semana: s.weekKey,
                ...Object.fromEntries(AREA_LABELS.map(label => [label, Math.max(0, Math.min(10, Number((useWeighted ? s.weightedScores?.[label] : s.baseScores?.[label]) ?? 0)))]))
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="semana" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280' }} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                {AREA_LABELS.slice(0, 6).map((label, idx) => (
                  <Line key={label} type="monotone" dataKey={label} stroke={['#6366f1','#22c55e','#ef4444','#f59e0b','#8b5cf6','#06b6d4'][idx%6]} dot={false} name={label} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No hay snapshots guardados aún
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

