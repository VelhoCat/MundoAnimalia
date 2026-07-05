import React from 'react';
import { Utensils, Droplets, HeartPulse, Home, Clock } from 'lucide-react';
import { getCareGuide } from '@/data/careGuides';

const iconMap = {
  food: Utensils,
  hygiene: Droplets,
  health: HeartPulse,
  home: Home,
  age: Clock,
};

export default function CareRecommendations({ animal }) {
  const { sections } = getCareGuide(animal);

  if (!sections.length) return null;

  const raza = animal?.raza && animal.raza.toLowerCase() !== 'mestizo' && animal.raza.toLowerCase() !== 'mestiza'
    ? animal.raza
    : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cuidados recomendados para <span className="font-medium text-foreground">{animal?.nombre}</span>
        {raza ? <>, según ser un/a <span className="font-medium text-foreground">{raza}</span></> : ''}.
      </p>

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = iconMap[section.iconKey] || HeartPulse;
          return (
            <div key={section.title} className="rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-semibold text-base">{section.title}</h4>
              </div>
              <ul className="space-y-2">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
