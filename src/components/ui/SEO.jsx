import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image = '/images/og-cover.jpg',
  type = 'website',
  schema = null 
}) {
  const location = useLocation();
  const siteName = 'Balaji Metal';
  const siteUrl = 'https://balajimetal.co';
  const canonicalUrl = `${siteUrl}${location.pathname}`;
  
  // Format page title
  const fullTitle = title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : `${siteName} | Industrial Couplings & Pulleys Rajkot`;
  const defaultDesc = 'Balaji Metal is a leading manufacturer of precision Pin Bush Couplings, Star Spider Couplings, V-Belt Pulleys and Hand Wheels in Rajkot, Gujarat.';
  const pageDescription = description || defaultDesc;
  const pageKeywords = keywords || 'Balaji Metal, Industrial Couplings, Pin Bush Coupling, Star Bush Coupling, V-Belt Pulley, Hand Wheel, Rajkot, Gujarat';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${siteUrl}${image}`} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
