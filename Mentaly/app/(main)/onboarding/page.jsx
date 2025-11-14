'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { AREAS, AREA_BADGE_CLASSES } from '@/lib/areas';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Inicializa valores por defecto
    const init = {};
    for (const area of AREAS) {
      init[area.label] = { satisfaction: 5, importance: 5 };
    }
    setValues(init);
  }, [user]);

  const handleChange = (label, field, newVal) => {
    setValues(prev => ({
      ...prev,
      [label]: {
        ...prev[label],
        [field]: Array.isArray(newVal) ? newVal[0] : newVal,
      }
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const profileRef = doc(db, 'users', user.uid);
      await setDoc(profileRef, {
        areas: values,
        onboardingCompleted: true,
      }, { merge: true });
      toast({ title: '¡Listo!', description: 'Preferencias guardadas', variant: 'success' });
      router.push('/dashboard');
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo guardar', variant: 'destructive' });
    }
    setSaving(false);
  };

  if (!user || Object.keys(values).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configura tu Rueda de la Vida</h1>
        <p className="mt-2 text-gray-600">Valora tu satisfacción actual y la importancia de cada área</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AREAS.map(({ label }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardDescription>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${AREA_BADGE_CLASSES[label] || 'bg-gray-100 text-gray-800'}`}>
                  Área
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block">Satisfacción actual: {values[label]?.satisfaction}</Label>
                <Slider min={0} max={10} step={1} value={[values[label]?.satisfaction || 0]} onValueChange={(v) => handleChange(label, 'satisfaction', v)} />
              </div>
              <div>
                <Label className="mb-2 block">Importancia para ti: {values[label]?.importance}</Label>
                <Slider min={0} max={10} step={1} value={[values[label]?.importance || 0]} onValueChange={(v) => handleChange(label, 'importance', v)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar y continuar'}
        </Button>
      </div>
    </div>
  );
}


