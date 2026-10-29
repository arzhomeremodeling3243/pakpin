// Canonical machine-readable identity for PakPin (Schema.org JSON-LD).
// Public facts only — no implementation details, no email addresses.
// The Organization @id below is the single canonical entity for PakPin;
// other pages (e.g. /about) reference it by @id instead of redefining it.

export const PAKPIN_ORGANIZATION_ID = 'https://www.geotaggingphotos.com/#organization'
export const PAKPIN_FOUNDER_ID = 'https://www.geotaggingphotos.com/about/#muhammad-imran'

export const FOUNDER_PORTFOLIO_URL = 'https://www.imrandigitals.com'
export const FOUNDER_LINKEDIN_URL = 'https://www.linkedin.com/in/muhammad-imran-972364373'

export const founderPersonSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PAKPIN_FOUNDER_ID,
  name: 'Muhammad Imran',
  jobTitle: 'Founder, Owner & CEO',
  description:
    'Muhammad Imran is the Founder, Owner & CEO of PakPin and the founder of Imran Digitals. He is a full-stack web & AI developer and technical SEO specialist based in Multan & Lahore, Pakistan.',
  url: FOUNDER_PORTFOLIO_URL,
  sameAs: [FOUNDER_PORTFOLIO_URL, FOUNDER_LINKEDIN_URL],
  worksFor: { '@id': PAKPIN_ORGANIZATION_ID },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Multan',
    addressRegion: 'Punjab',
    addressCountry: 'PK',
  },
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': PAKPIN_ORGANIZATION_ID,
  name: 'PakPin',
  url: 'https://www.geotaggingphotos.com/',
  logo: 'https://www.geotaggingphotos.com/logo.svg',
  description:
    "PakPin is Pakistan's free business directory, covering 183 cities and 24 business categories. Any business can create a free listing and get its own individual profile page that can be found and ranked on Google. PakPin also offers company profiles, a jobs board and customer reviews.",
  foundingDate: '2026',
  areaServed: {
    '@type': 'Country',
    name: 'Pakistan',
  },
  founder: { '@id': PAKPIN_FOUNDER_ID },
  telephone: '+92 334 5636230',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+92 334 5636230',
    contactType: 'customer service',
    areaServed: 'PK',
    availableLanguage: ['en', 'ur'],
  },
}
