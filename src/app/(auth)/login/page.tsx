"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChefHat, Shield, Truck, User, LogIn } from "lucide-react"
import Link from "next/link"

type StaffLevel = "admin" | "owner" | "kurir"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"pelanggan" | "staff">("pelanggan")
  const [selectedRole, setSelectedRole] = useState<StaffLevel>("admin")
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // 1. Login Auth Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) throw loginError
      if (!data.user) throw new Error("Login gagal, cek email dan password.")

      // 2. Cek Role dan Redirect
      if (activeTab === "staff") {
        // Jika Staff, cek tabel users untuk dapat level
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("level")
          .eq("email", email)
          .single()

        if (userError || !userData) {
          throw new Error("Akun Staff tidak ditemukan di database.")
        }

        const userLevel = userData.level
        if (!userLevel) {
          throw new Error("Level akun tidak tersedia.")
        }

        // Validasi: Pastikan role yang dipilih sesuai dengan database
        if (userLevel !== selectedRole) {
          throw new Error(`Akun ini terdaftar sebagai ${userLevel.toUpperCase()}, bukan ${selectedRole.toUpperCase()}.`)
        }

        // Redirect sesuai Level
        if (userLevel === "admin") {
          router.push("/admin/paket")
        } else if (userLevel === "owner") {
          router.push("/owner")
        } else if (userLevel === "kurir") {
          router.push("/kurir")
        }
      } else {
        // Jika Pelanggan, redirect ke Home
        router.push("/")
      }

      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-100 via-cream-100 to-terracotta-50 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-800 py-12 px-4">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${
              activeTab === 'staff' ? 'bg-terracotta-500' : 'bg-primary-500'
            }`}>
              {activeTab === 'staff' ? <Shield className="w-8 h-8 text-cream-100" /> : <ChefHat className="w-8 h-8 text-cream-100" />}
            </div>
          </div>
          <CardTitle className="font-display text-3xl font-bold">Selamat Datang</CardTitle>
          <CardDescription className="text-charcoal-900/70 dark:text-cream-100/70">
            Login sebagai {activeTab === 'staff' ? 'Staff Internal' : 'Pelanggan'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* === TAB SWITCHER === */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("pelanggan")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "pelanggan" 
                    ? "bg-white text-primary-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <User className="w-4 h-4 inline mr-2" /> Pelanggan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("staff")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "staff" 
                    ? "bg-white text-terracotta-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" /> Staff
              </button>
            </div>

            {/* === ROLE SELECTION (Hanya untuk Staff) === */}
            {activeTab === "staff" && (
              <div className="mb-4 p-3 bg-terracotta-50/50 border border-terracotta-200 rounded-lg">
                <Label className="text-sm font-semibold mb-2 block">Pilih Role:</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    className={`flex flex-col items-center justify-center p-2 rounded-md border text-xs transition-all ${
                      selectedRole === "admin"
                        ? "bg-terracotta-500 text-white border-terracotta-500 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="w-4 h-4 mb-1" />
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("owner")}
                    className={`flex flex-col items-center justify-center p-2 rounded-md border text-xs transition-all ${
                      selectedRole === "owner"
                        ? "bg-gold-500 text-white border-gold-500 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <ChefHat className="w-4 h-4 mb-1" />
                    Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("kurir")}
                    className={`flex flex-col items-center justify-center p-2 rounded-md border text-xs transition-all ${
                      selectedRole === "kurir"
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1" />
                    Kurir
                  </button>
                </div>
              </div>
            )}

            {/* Input Fields */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={activeTab === 'staff' ? "staff@catering.app" : "nama@email.com"}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <Button 
              type="submit" 
              className={`w-full mt-4 transition-all ${
                activeTab === 'pelanggan' 
                  ? 'bg-primary-500 hover:bg-primary-600' 
                  : 'bg-terracotta-500 hover:bg-terracotta-600'
              }`} 
              disabled={loading}
            >
              {loading ? "Loading..." : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Masuk sebagai {activeTab === 'staff' ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : 'Pelanggan'}
                </>
              )}
            </Button>
          </form>

          {/* Link Register */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Belum punya akun?</span>{" "}
            <Link href="/register" className="text-primary-500 hover:underline font-medium">
              Daftar sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}