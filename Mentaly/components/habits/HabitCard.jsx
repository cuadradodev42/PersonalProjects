'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';

const CATEGORY_COLORS = {
  'Salud Física': 'bg-green-100 text-green-800 border-green-200',
  'Salud Mental': 'bg-blue-100 text-blue-800 border-blue-200',
  'Finanzas': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Carrera/Estudios': 'bg-purple-100 text-purple-800 border-purple-200',
  'Relaciones Familiares': 'bg-pink-100 text-pink-800 border-pink-200',
  'Relaciones Sociales': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Desarrollo Personal': 'bg-orange-100 text-orange-800 border-orange-200',
  'Ocio/Diversión': 'bg-teal-100 text-teal-800 border-teal-200',
};

export default function HabitCard({ habit, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(habit)}
              className="h-8 w-8 text-gray-600 hover:text-indigo-600"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(habit.id)}
              className="h-8 w-8 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`inline-block px-3 py-1 text-sm rounded-full border ${
              CATEGORY_COLORS[habit.category] || 'bg-gray-100 text-gray-800 border-gray-200'
            }`}
          >
            {habit.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

