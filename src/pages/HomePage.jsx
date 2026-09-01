import React from 'react';
import SEO from '@/components/ui/SEO';
import HeroSection from '@/components/home/HeroSection';
import CompanyStats from '@/components/home/CompanyStats';
import CompanyIntro from '@/components/home/CompanyIntro';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ManufacturingProcess from '@/components/home/ManufacturingProcess';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import ContactCTA from '@/components/home/ContactCTA';

const HomePage = () => {
  return (
    <>
      <SEO 
        title="Balaji Metal | Industrial Couplings, Pulleys & Power Transmission Components" 
        description="Balaji Metal is a leading manufacturer of heavy-duty Pin Bush Couplings, Star Spider Couplings, and dynamically balanced V-Belt Pulleys in Rajkot, Gujarat." 
        keywords="industrial couplings, pin bush coupling, star bush coupling, spider coupling, v-belt pulley, cast iron hand wheel, taper bush, Balaji Metal, Rajkot manufacturer"
      />
      <main className="flex flex-col min-h-screen bg-slate-950">
        <HeroSection />
        <CompanyStats />
        <CompanyIntro />
        <FeaturedProducts />
        <ManufacturingProcess />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <ContactCTA />
      </main>
    </>
  );
};

export default HomePage;
