'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAchievements } from '@/lib/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Loader2, Trophy, Star, Sparkles } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ACHIEVEMENT_CATALOG } from '@/lib/achievement_catalog';

const RARITY_STYLES = {
  common: {
    border: 'border-gray-300',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-800',
  },
  rare: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800',
  },
  epic: {
    border: 'border-purple-300',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800',
  },
  legendary: {
    border: 'border-yellow-300',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-800',
  },
};

function AchievementCard({ achievement }) {
  const rarity = achievement.rarity || 'common';
  const styles = RARITY_STYLES[rarity];

  return (
    <Card className={`${styles.border} ${styles.bg} border-2 hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="text-5xl">{achievement.icon || '🏆'}</div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-bold ${styles.text}`}>
                {achievement.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.badge}`}>
                {rarity === 'common' && 'Común'}
                {rarity === 'rare' && 'Raro'}
                {rarity === 'epic' && 'Épico'}
                {rarity === 'legendary' && 'Legendario'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-3">{achievement.description}</p>
            
            {achievement.unlockedAt && (
              <p className="text-xs text-gray-500">
                Desbloqueado: {formatDate(achievement.unlockedAt)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const CATALOG = ACHIEVEMENT_CATALOG;

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    setLoading(true);
    const result = await getAchievements(user.uid);
    
    if (result.success) {
      setAchievements(result.data);
    }
    
    setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
          Logros
        </h1>
        <p className="mt-2 text-gray-600">
          {achievements.length > 0 
            ? `Has desbloqueado ${achievements.length} logro${achievements.length !== 1 ? 's' : ''}`
            : 'Completa hábitos para desbloquear logros'}
        </p>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <Sparkles className="w-16 h-16 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes logros desbloqueados
            </h3>
            <p className="text-gray-600 mb-4">
              Completa hábitos para empezar a desbloquear logros increíbles
            </p>
            <div className="text-left max-w-sm mx-auto bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Próximos logros:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🌱 Primer Paso - Completa tu primer hábito</li>
                <li>⭐ Principiante Dedicado - Completa 5 hábitos</li>
                <li>💪 Cuerpo Sano - Completa 5 hábitos de Salud Física</li>
                <li>📅 Racha de 3 Días - Completa hábitos 3 días seguidos</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {achievements.filter(a => a.rarity === 'common').length}
                </div>
                <div className="text-sm text-gray-600">Comunes</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {achievements.filter(a => a.rarity === 'rare').length}
                </div>
                <div className="text-sm text-blue-600">Raros</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {achievements.filter(a => a.rarity === 'epic').length}
                </div>
                <div className="text-sm text-purple-600">Épicos</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {achievements.filter(a => a.rarity === 'legendary').length}
                </div>
                <div className="text-sm text-yellow-600">Legendarios</div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de logros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </>
      )}

      {/* Catálogo (bloqueados) */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Catálogo de Logros</h2>
        <p className="text-sm text-gray-600 mb-4">Los no desbloqueados aparecerán atenuados</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATALOG.map((item) => {
            const unlocked = achievements.some(a => a.name === item.name);
            return (
              <Card key={item.name} className={`${unlocked ? '' : 'opacity-60'} border` }>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    {item.name}
                  </CardTitle>
                  <CardDescription className="capitalize">{item.rarity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                  {!unlocked && (
                    <p className="text-xs text-gray-400 mt-2">Bloqueado</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

