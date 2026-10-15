import { siteConfig } from '@/data/siteConfig';

export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteConfig.url,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}/images/logo.png`,
          caption: siteConfig.name,
        },
        description: siteConfig.description,
        telephone: siteConfig.phones[0],
        email: siteConfig.email,
        address: siteConfig.addresses.map((addr) => ({
          '@type': 'PostalAddress',
          streetAddress: `${addr.line1}, ${addr.line2}`,
          addressLocality: addr.city,
          addressRegion: addr.state,
          postalCode: addr.pin,
          addressCountry: 'IN',
        })),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.shortName,
        publisher: {
          '@id': `${siteConfig.url}/#organization`,
        },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteConfig.url}/#service`,
        name: siteConfig.name,
        image: `${siteConfig.url}/images/logo.png`,
        telephone: siteConfig.phones[0],
        email: siteConfig.email,
        priceRange: '₹₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${siteConfig.addresses[0].line1}, ${siteConfig.addresses[0].line2}`,
          addressLocality: siteConfig.addresses[0].city,
          addressRegion: siteConfig.addresses[0].state,
          postalCode: siteConfig.addresses[0].pin,
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '19.0144',
          longitude: '73.0388',
        },
        areaServed: [
          { '@type': 'City', name: 'Navi Mumbai' },
          { '@type': 'City', name: 'Mumbai' },
          { '@type': 'AdministrativeArea', name: 'MMR' },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
