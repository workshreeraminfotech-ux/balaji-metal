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
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://balajimetal.co/#website",
        "url": "https://balajimetal.co",
        "name": "Balaji Metal",
        "description": "Manufacturer of Heavy-Duty Pin Bush Couplings, Star Bush Couplings & Pulleys",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://balajimetal.co/products?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://balajimetal.co/#organization",
        "name": "Balaji Metal",
        "url": "https://balajimetal.co",
        "logo": "https://balajimetal.co/favicon.svg",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-7096070727",
          "contactType": "Sales and Support",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi", "gu"]
        }
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Balaji Metal | Industrial Couplings, Pulleys & Power Transmission Components Rajkot" 
        description="Balaji Metal is a leading manufacturer of heavy-duty Pin Bush Couplings, Star Spider Couplings, and dynamically balanced V-Belt Pulleys in Rajkot, Gujarat. Direct factory dispatch." 
        keywords="Balaji Metal, Balaji Metal Rajkot, industrial couplings, pin bush coupling, star bush coupling, spider coupling, v-belt pulley, cast iron hand wheel, taper bush, Rajkot manufacturer"
        schema={homeSchema}
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
