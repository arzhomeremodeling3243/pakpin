import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search the PakPin Directory',
  description: 'Search businesses and companies across Pakistan by name, keyword, category, and city on PakPin.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.geotaggingphotos.com/search/' },
}

export default function SearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
