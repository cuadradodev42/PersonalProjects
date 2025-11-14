'use client';

import LifeWheelChart from '@/components/dashboard/LifeWheelChart';
import TodaysHabits from '@/components/dashboard/TodaysHabits';
import SuggestedHabits from '@/components/dashboard/SuggestedHabits';
import GamificationWidget from '@/components/dashboard/GamificationWidget';

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white drop-shadow-sm">
          Bienvenido a Mentaly. Aquí puedes ver tu progreso diario y tu balance de vida.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-6">
        <TodaysHabits />
        <LifeWheelChart />
      </div>

      <SuggestedHabits />

      <GamificationWidget />
    </div>
  );
}

