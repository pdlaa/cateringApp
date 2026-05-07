"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChefHat, Shield, Truck, User } from "lucide-react"
import Link from "next/link"

// Pisahkan type
type StaffLevel = "admin" | "owner" | "kurir"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"pelanggan" | "staff">("pelanggan")
  const [staffRole, setStaffRole] = useState<StaffLevel>("admin") // ✅ Type StaffLevel
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    
    try {
      // 1. Register di Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // 2. Insert ke Database Sesuai Role
      if (data.user) {
        if (activeTab === "pelanggan") {
          // Insert ke tabel pelanggans
          const tgl_lahir = formData.get("tgl_lahir") as string
          const telepon = formData.get("telepon") as string
          const alamat1 = formData.get("alamat1") as string
          const alamat2 = formData.get("alamat2") as string
          const alamat3 = formData.get("alamat3") as string
          const kartu_id = formData.get("kartu_id") as string

          const { error: insertError } = await supabase
            .from("pelanggans")
            .insert({
              email,
              name_pelanggan: name,
              password: password,
              tgl_lahir: tgl_lahir || null,
              telepon: telepon || null,
              alamat1: alamat1 || null,
              alamat2: alamat2 || null,
              alamat3: alamat3 || null,
              kartu_id: kartu_id || null,
            })

          if (insertError) throw insertError
        } else {
          // Insert ke tabel users (Staff)
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              email,
              name: name,
              password: password,
              level: staffRole, // ✅ Sekarang type-nya StaffLevel
            })

          if (insertError) throw insertError
        }
      }

      alert("Registrasi berhasil! Silakan login.")
      router.push("/login")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Terjadi kesalahan saat registrasi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-100 via-cream-100 to-terracotta-50 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-800 py-12 px-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-cream-100" />
            </div>
          </div>
          <CardTitle className="font-display text-3xl font-bold">Daftar Akun</CardTitle>
          <CardDescription className="text-charcoal-900/70 dark:text-cream-100/70">
            {activeTab === 'pelanggan' ? 'Daftar untuk memesan catering' : 'Daftar sebagai Staff Internal'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* === TAB SWITCHER === */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
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
                <Shield className="w-4 h-4 inline mr-2" /> Staff Internal
              </button>
            </div>

            {/* === FORM STAFF (ADMIN, OWNER, KURIR) === */}
            {activeTab === "staff" && (
              <div className="space-y-4 p-4 border border-terracotta-200 rounded-xl bg-terracotta-50/30">
                <h3 className="font-semibold text-lg text-terracotta-700">Data Staff</h3>
                
                {/* Role Selector */}
                <div className="space-y-2">
                  <Label>Pilih Role</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setStaffRole("admin")}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${
                        staffRole === "admin"
                          ? "bg-terracotta-500 text-white border-terracotta-500 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Shield className="w-5 h-5 mb-1" />
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffRole("owner")}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${
                        staffRole === "owner"
                          ? "bg-gold-500 text-white border-gold-500 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <ChefHat className="w-5 h-5 mb-1" />
                      Owner
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffRole("kurir")}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${
                        staffRole === "kurir"
                          ? "bg-primary-600 text-white border-primary-600 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Truck className="w-5 h-5 mb-1" />
                      Kurir
                    </button>
                  </div>
                </div>

                {/* Fields Staff */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" name="name" type="text" placeholder="Nama Staff" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Staff</Label>
                  <Input id="email" name="email" type="email" placeholder="staff@catering.app" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
              </div>
            )}

            {/* === FORM PELANGGAN (DETAIL) === */}
            {activeTab === "pelanggan" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" name="name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tgl_lahir">Tanggal Lahir</Label>
                    <Input id="tgl_lahir" name="tgl_lahir" type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="nama@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telepon">Nomor Telepon</Label>
                    <Input id="telepon" name="telepon" type="tel" placeholder="08123456789" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat1">Alamat Lengkap (Jalan/Gedung)</Label>
                  <Input id="alamat1" name="alamat1" type="text" placeholder="Jl. Contoh No. 123" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alamat2">Kelurahan/Kecamatan</Label>
                    <Input id="alamat2" name="alamat2" type="text" placeholder="Kelurahan, Kecamatan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alamat3">Kota/Kabupaten</Label>
                    <Input id="alamat3" name="alamat3" type="text" placeholder="Kota/Kabupaten" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kartu_id">Nomor KTP/Identitas</Label>
                  <Input id="kartu_id" name="kartu_id" type="text" placeholder="Nomor KTP" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full ${
                activeTab === 'pelanggan' 
                  ? 'bg-primary-500 hover:bg-primary-600' 
                  : 'bg-terracotta-500 hover:bg-terracotta-600'
              }`} 
              disabled={loading}
            >
              {loading ? "Loading..." : "Daftar Sekarang"}
            </Button>

            <p className="text-center text-sm text-charcoal-900/60 dark:text-cream-100/60">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary-500 hover:underline font-medium">
                Login di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}