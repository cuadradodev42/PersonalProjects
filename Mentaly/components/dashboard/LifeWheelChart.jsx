'use client';

import { useEffect, useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { getHabits, getUserProfile, calculateLifeWheelScores, upsertLifeWheelWeeklySnapshot } from '@/lib/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LifeWheelChart() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useWeighted, setUseWeighted] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    
    // Obtener hábitos del usuario
    const habitsResult = await getHabits(user.uid);
    
    if (!habitsResult.success) {
      setLoading(false);
      return;
    }

    const habits = habitsResult.data;

    // Calcular puntajes de la Rueda de la Vida
    const scoresResult = await calculateLifeWheelScores(user.uid, habits, 30);
    
    if (!scoresResult.success) {
      setLoading(false);
      return;
    }

    const scores = scoresResult.data; // 0-10 por categoría (base)

    // Obtener importancia por área del perfil del usuario (0-10)
    let importanceMap = {};
    const profileResult = await getUserProfile(user.uid);
    if (profileResult.success && profileResult.data?.areas) {
      const areas = profileResult.data.areas;
      Object.keys(areas).forEach(label => {
        importanceMap[label] = typeof areas[label]?.importance === 'number' ? areas[label].importance : 5;
      });
    }

    // Si no hay hábitos/scores, mostrar satisfacción inicial del onboarding
    const showInitial = Object.values(scores || {}).every(v => !v || v === 0) && Object.keys(importanceMap).length > 0;

    // Preparar datos ponderando por importancia: weighted = base * (importance/10)
    const data = Object.keys(scores).map(category => {
      const baseFromHabits = typeof scores[category] === 'number' ? scores[category] : 0;
      const baseFromOnboarding = profileResult.success && profileResult.data?.areas?.[category]?.satisfaction;
      const base = showInitial && typeof baseFromOnboarding === 'number' ? baseFromOnboarding : baseFromHabits;
      const importance = typeof importanceMap[category] === 'number' ? importanceMap[category] : 5;
      const weighted = Math.round(base * (importance / 10));
      return {
        category,
        value: weighted, // valor mostrado en el radar
        baseValue: base,
        importance,
        fullMark: 10,
      };
    });

    setChartData(data);
    setLoading(false);

    // Guardar snapshot semanal (base y ponderado)
    try {
      await upsertLifeWheelWeeklySnapshot(
        user.uid,
        scores,
        importanceMap,
        useWeighted
      );
    } catch {}
  };

  // Cargar preferencia desde localStorage y Firestore
  useEffect(() => {
    try {
      const localVal = localStorage.getItem('lifeWheelUseWeighted');
      if (localVal !== null) setUseWeighted(localVal === 'true');
    } catch {}
  }, []);

  useEffect(() => {
    const loadPref = async () => {
      if (!user) return;
      const profileResult = await getUserProfile(user.uid);
      if (profileResult.success) {
        const pref = profileResult.data?.settings?.lifeWheel?.useWeighted;
        if (typeof pref === 'boolean') setUseWeighted(pref);
      }
    };
    loadPref();
  }, [user]);

  if (loading) {
    return (
      <Card className="glass-effect border-white/20">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-lg sm:text-xl">Rueda de la Vida</CardTitle>
          <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">Visualiza tu balance de vida</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60 sm:h-80 p-4 sm:p-6">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="glass-effect border-white/20">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-lg sm:text-xl">Rueda de la Vida</CardTitle>
          <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">Visualiza tu balance de vida</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60 sm:h-80 p-4 sm:p-6">
          <p className="text-white drop-shadow-sm text-center text-sm sm:text-base">
            Crea hábitos en diferentes categorías para ver tu Rueda de la Vida
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="text-white text-lg sm:text-xl">Rueda de la Vida</CardTitle>
            <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
              {useWeighted ?
                'Puntajes ponderados por importancia (0–10) en tus áreas (últimos 30 días)'
                : 'Puntajes base (0–10) en tus áreas (últimos 30 días)'}
            </CardDescription>
          </div>
          <label className="flex items-center gap-2 text-sm text-white drop-shadow-sm select-none">
            <Checkbox
              id="weighted"
              checked={useWeighted}
              onCheckedChange={async (v) => {
                const val = !!v;
                setUseWeighted(val);
                try { localStorage.setItem('lifeWheelUseWeighted', String(val)); } catch {}
                try {
                  if (user) {
                    const userRef = doc(db, 'users', user.uid);
                    await updateDoc(userRef, {
                      'settings.lifeWheel.useWeighted': val
                    });
                  }
                } catch {}
              }}
            />
            Ponderar por importancia
          </label>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              style={{ fontSize: '12px' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 10]} 
              tick={{ fill: '#6b7280' }}
            />
            <Radar
              name={useWeighted ? 'Puntaje (Ponderado)' : 'Puntaje (Base)'}
              dataKey={useWeighted ? 'value' : 'baseValue'}
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.6}
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
                return [
                  `${value}`,
                  'Puntaje base'
                ];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>El puntaje mostrado = Base × (Importancia / 10). Base deriva de hábitos completados.</p>
        </div>
      </CardContent>
    </Card>
  );
}

