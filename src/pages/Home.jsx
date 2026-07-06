import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedAnimals from '../components/home/FeaturedAnimals';
import HowItWorks from '../components/home/HowItWorks';
import BenefitsSection from '../components/home/BenefitsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedAnimals />
      <HowItWorks />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
