import Link from "next/link"
import { ShoppingBag, MessageCircle } from "lucide-react"

// ─────────────────────────────────────────
// SVG Icons (Inline - Tidak tergantung library)
// ─────────────────────────────────────────
const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-terracotta-500 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-cream-100" />
              </div>
              <span className="font-display text-2xl font-bold">
                Catering<span className="text-terracotta-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-cream-100/70 tracking-wide">
              Penyedia catering premium untuk momen spesial Anda dengan cita rasa autentik dan pelayanan terbaik.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2 text-sm">
              {["Paket Prasmanan", "Paket Box", "Catering Harian", "Catering Acara"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-cream-100/70 hover:text-terracotta-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-sm">
              {["Tentang Kami", "Testimoni", "Blog", "Karir"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-cream-100/70 hover:text-terracotta-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-2 text-sm text-cream-100/70">
              <li>Jl. Catering No. 123</li>
              <li>Jakarta, Indonesia</li>
              <li>+62 812-3456-7890</li>
              <li>hello@catering.app</li>
            </ul>
            
            {/* Social Media - SVG Inline Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream-100/10 flex items-center justify-center hover:bg-terracotta-500 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream-100/10 flex items-center justify-center hover:bg-terracotta-500 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream-100/10 flex items-center justify-center hover:bg-terracotta-500 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream-100/10 mt-12 pt-8 text-center text-sm text-cream-100/50">
          <p>&copy; {new Date().getFullYear()} Catering App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}