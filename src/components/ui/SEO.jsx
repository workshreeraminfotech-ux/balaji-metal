import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords }) {
  const siteName = 'Balaji Metal';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
  );
}
