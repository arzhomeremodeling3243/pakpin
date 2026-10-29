'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Factory, ArrowRight, Info } from 'lucide-react'
import { toast } from 'sonner'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { CATEGORIES, CITIES } from '@/lib/data'
import CityCombobox from '@/components/city-combobox'
import { isValidPakistaniPhone, normalizePakistaniPhone, sanitizePhoneInput } from '@/lib/validation'
import { writeOwnerContact } from '@/lib/owner-contact'
import { queueSubmissionEmails } from '@/lib/mail'
import TierSelect from '@/components/tier-select'
import PaymentScreen from '@/components/payment-screen'
import type { ListingTier } from '@/lib/tiers'

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const inputClass =
  'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-700'
const labelClass = 'block text-xs font-bold text-slate-700 mb-1'

export default function AddCompanyPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [tier, setTier] = useState<ListingTier>('basic')
  // After the profile SAVES, the payment screen takes over this page —
  // the submission email goes out only once the proof is submitted.
  const [saved, setSaved] = useState<{ id: string; name: string } | null>(null)
  const [industry, setIndustry] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/login')
        return
      }
      setUser(u)
      setAuthLoading(false)
    })
    return () => unsub()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!isValidPakistaniPhone(phone)) {
      toast.error('Please enter a valid Pakistani mobile number (e.g. 0300 1234567 or +92 300 1234567).')
      return
    }
    setIsSubmitting(true)
    try {
      const ref = await addDoc(collection(db, 'companies'), {
        name: name.trim(),
        slug: `${slugify(name)}-${slugify(city)}`,
        industry,
        city,
        phone: normalizePakistaniPhone(phone),
        email: email.trim(),
        website: website.trim(),
        address: address.trim(),
        description: description.trim(),
        ownerId: user.uid,
        ownerName: user.displayName || '',
        tier,
        paymentStatus: 'awaiting_payment',
        projects: [],
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      // Owner contact (login email) is private: it goes to the
      // owner/admin-only subcollection, never into the main document
      // (see lib/owner-contact.ts).
      await writeOwnerContact('companies', ref.id, user.uid, user.email || '')
      // The profile is SAVED now; the payment screen below collects the
      // tier payment. Submission emails go out only after the proof is
      // submitted (see onSubmitted on the PaymentScreen).
      setSaved({ id: ref.id, name: name.trim() })
      toast.success('Company saved — complete your payment below.')
    } catch (err: any) {
      toast.error(`Could not submit your company: ${err?.message || 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="bg-[#F8FAFC] min-h-screen py-16 px-4 flex items-center justify-center">
          <p className="text-sm text-slate-400">Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  // Payment step: the profile is saved; collect the tier payment here.
  if (saved && user) {
    return (
      <>
        <Navbar />
        <main className="bg-[#F8FAFC] text-slate-800 font-sans min-h-screen py-16 px-4 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            <PaymentScreen
              tier={tier}
              listingType="company"
              listingId={saved.id}
              listingName={saved.name}
              ownerId={user.uid}
              ownerEmail={user.email || ''}
              onSubmitted={async () => {
                // Emails: owner gets "received, under review", admin gets
                // a new-submission notification. Both only queue into
                // `mail` and never throw.
                await queueSubmissionEmails({
                  kind: 'company',
                  name: saved.name,
                  city,
                  ownerEmail: user.email || '',
                  ownerName: user.displayName || '',
                })
                toast.success('Payment proof submitted — we will email you once it is verified.')
                router.push('/dashboard')
              }}
            />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAFC] text-slate-800 font-sans min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-700 mb-3">
              <Factory className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Add Your Company</h1>
            <p className="text-xs text-slate-500 mt-1">Affordable one-time company profile — build trust with buyers across Pakistan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Company Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Pak Industries (Pvt) Ltd" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Industry *</label>
                <select required value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputClass}>
                  <option value="" disabled>Select an industry</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <CityCombobox required value={city} onChange={setCity} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone *</label>
                <input type="tel" inputMode="tel" required value={phone} onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))} placeholder="+92 300 1234567" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@company.pk" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Website</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourcompany.pk" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Office 303, Evacuee Trust Complex, F-5/1" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Tell buyers what your company does, your products or services, and your track record." className={inputClass} />
            </div>

            <div className="flex gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-slate-600">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span>Your company profile goes through a quick review and appears publicly on PakPin after approval.</span>
            </div>

            <TierSelect value={tier} onChange={setTier} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Company'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
