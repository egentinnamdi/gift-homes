import Link from "next/link"
import { ShieldCheck, Eye, Handshake, MapPinned, ArrowRight, Video, FileCheck2 } from "lucide-react"
import { CtaBanner } from "@/components/layout/cta-banner"
import { Testimonials } from "@/components/home/testimonials"

export const metadata = {
  title: "About GiftHomes | Enugu Real Estate",
  description:
    "GiftHomes is an Enugu-based real estate company connecting local and diaspora clients with verified properties.",
}

const stats = [
  { value: "500+", label: "Properties verified" },
  { value: "1,200+", label: "Happy clients" },
  { value: "12", label: "Enugu neighborhoods" },
  { value: "10 yrs", label: "Local experience" },
]

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Titles",
    text: "Every listing is checked for documentation — C of O, Governor's Consent or Deed of Assignment — before it goes live.",
  },
  {
    icon: Eye,
    title: "Radical Transparency",
    text: "Clear pricing, honest descriptions and real photos. No hidden fees, no surprises on inspection day.",
  },
  {
    icon: Video,
    title: "Built for the Diaspora",
    text: "Live video inspections and remote paperwork support let you buy or rent in Enugu from anywhere in the world.",
  },
  {
    icon: Handshake,
    title: "Local Relationships",
    text: "Our Enugu team knows the streets, the developers and the neighbors — and puts your interests first.",
  },
]

const steps = [
  { title: "Browse", text: "Filter verified listings by neighborhood, type and budget." },
  { title: "Inspect", text: "Book an in-person visit or a live video tour with our agents." },
  { title: "Verify", text: "We walk you through title documents and due diligence." },
  { title: "Move in", text: "Sign, pay securely and collect your keys." },
]

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#262626] bg-[#141414] py-14 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="pointer-events-none absolute top-1/3 -left-24 size-96 rounded-full bg-[#703BF7]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9]">
            <MapPinned className="size-3.5 text-[#703BF7]" />
            About GiftHomes
          </div>
          <h1 className="max-w-3xl font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl">
            Real estate in Enugu you can{" "}
            <span className="bg-gradient-to-r from-white via-[#EDE7FE] to-[#946CF9] bg-clip-text text-transparent">
              actually trust
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#999999] sm:text-lg">
            GiftHomes is an Enugu-based agency helping families, professionals and diaspora investors find
            verified homes to buy or rent — from duplexes in GRA to serviced apartments in Independence Layout.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/properties" className="inline-flex items-center gap-2 rounded-xl bg-[#703BF7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/25 hover:bg-[#8254F8]">
              Browse Properties <ArrowRight className="size-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-[#262626] bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-white hover:border-[#703BF7]">
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 text-center">
              <p className="font-heading text-3xl font-extrabold text-white">{s.value}</p>
              <p className="mt-1 text-xs text-[#999999]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#262626] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Our story &amp; mission</h2>
          <div className="mt-4 grid gap-8 text-sm leading-relaxed text-[#999999] lg:grid-cols-2">
            <p>
              Property in Nigeria has too often meant disputed titles, inflated prices and agents who vanish after a
              deposit. We started GiftHomes in Enugu to change that: a small team that does the legwork — site visits,
              document checks, honest pricing — so you don&apos;t have to take anyone&apos;s word for it.
            </p>
            <p>
              Today we serve residents across Enugu and a growing community abroad who want to invest back home with
              confidence. Our mission is simple: make finding, verifying and securing a home in Enugu as clear and
              dependable as anywhere in the world.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#262626] bg-[#141414] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">What we stand for</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 transition-colors hover:border-[#333333]">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#703BF7]/15 text-[#946CF9]">
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#999999]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#262626] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-white sm:text-3xl">
            <FileCheck2 className="size-6 text-[#703BF7]" /> How it works
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6">
                <span className="font-heading text-sm font-bold text-[#703BF7]">0{i + 1}</span>
                <h3 className="mt-2 font-heading text-base font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#999999]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Testimonials />
      <CtaBanner />
    </div>
  )
}
