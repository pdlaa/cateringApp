"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-client"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    checkAuth()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const checkAuth = async () => {
  const { data } = await supabase.auth.getSession()
  const session = data?.session
  
  if (session && session.user.email) {
    setIsLoggedIn(true)
    const userEmail = session.user.email
    
    // Get user name from users table
    const { data: userData } = await supabase
      .from("users")
      .select("name")
      .eq("email", userEmail)
      .single()
    
    if (userData?.name) {
      setUserName(userData.name)
    } else {
      // Get from pelanggans table
      const { data: pelangganData } = await supabase
        .from("pelanggans")
        .select("name_pelanggan")
        .eq("email", userEmail)
        .single()
      
      if (pelangganData?.name_pelanggan) {
        setUserName(pelangganData.name_pelanggan)
      }
    }
  }
}

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUserName("")
    router.push("/")
    router.refresh()
  }

  return (
    <>
      {/* Desktop Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass shadow-lg py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 text-cream-100" />
              </motion.div>
              <span className="font-display text-2xl font-bold text-charcoal-900 dark:text-cream-100">
                Catering<span className="text-terracotta-500">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {["Beranda", "Menu", "Tentang", "Kontak"].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium tracking-wider text-charcoal-900/80 dark:text-cream-100/80 hover:text-primary-500 dark:hover:text-primary-500 transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA Buttons - Conditional */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1 text-sm text-charcoal-900 dark:text-cream-100">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{userName || "User"}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Masuk
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild
                    className="bg-primary-500 hover:bg-primary-600 text-cream-100"
                  >
                    <Link href="/register">
                      Pesan Sekarang
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-charcoal-900 dark:text-cream-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-cream-100 dark:bg-charcoal-900 md:hidden"
          >
            <div className="flex flex-col items-center justify-center gap-8 p-6">
              {["Beranda", "Menu", "Tentang", "Kontak"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-display font-bold text-charcoal-900 dark:text-cream-100"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Auth Buttons - Conditional */}
              <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 justify-center mb-4 text-charcoal-900 dark:text-cream-100">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{userName || "User"}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
                    </Button>
                    <Button 
                      size="lg" 
                      asChild
                      className="bg-primary-500 hover:bg-primary-600 text-cream-100"
                    >
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Pesan Sekarang</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}