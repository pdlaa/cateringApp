"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Cek apakah ini halaman admin/owner/kurir
  const isAdminPage = pathname?.startsWith('/admin') || 
                      pathname?.startsWith('/owner') || 
                      pathname?.startsWith('/kurir')

  return (
    <>
      {/* Navbar hanya muncul di halaman publik */}
      {!isAdminPage && <Navbar />}
      
      <main className={!isAdminPage ? "pt-20" : ""}>
        {children}
      </main>
      
      {/* Footer hanya muncul di halaman publik */}
      {!isAdminPage && <Footer />}
    </>
  )
}