import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact PakPin – Support, Listings & Partnerships',
  description: 'Contact PakPin: email support@geotaggingphotos.com or admin@geotaggingphotos.com, call +92 334 5636230, or visit Office 303, Evacuee Trust Complex, F-5/1, Islamabad.',
  alternates: { canonical: 'https://www.geotaggingphotos.com/contact/' },
  openGraph: {
    title: 'Contact PakPin – Support, Listings & Partnerships',
    description: 'Contact PakPin: email support@geotaggingphotos.com or admin@geotaggingphotos.com, call +92 334 5636230, or visit Office 303, Evacuee Trust Complex, F-5/1, Islamabad.',
    url: 'https://www.geotaggingphotos.com/contact/',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
