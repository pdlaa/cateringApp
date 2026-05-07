"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChefHat, User } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, isStaff: boolean) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) throw loginError

      if (!authData.user) {
        throw new Error("User tidak ditemukan")
      }

      // Cek role user berdasarkan email
      if (isStaff) {
        const {  data: userData, error: userError } = await supabase
          .from("users")
          .select("level")
         .eq("email", email as string)
          .single()

        if (userError || !userData) {
          throw new Error("Data user tidak ditemukan di database")
        }

        if (userData.level === "admin") {
          router.push("/admin/paket")
        } else if (userData.level === "owner") {
          router.push("/owner")
        } else if (userData.level === "kurir") {
          router.push("/kurir")
        } else {
          throw new Error("Role tidak dikenali")
        }
      } else {
        // Pelanggan
        router.push("/")
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-100 via-cream-100 to-terracotta-50 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-800 py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-cream-100" />
            </div>
          </div>
          <CardTitle className="font-display text-3xl font-bold">Selamat Datang</CardTitle>
          <CardDescription className="text-charcoal-900/70 dark:text-cream-100/70">
            Login untuk melanjutkan ke akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pelanggan" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pelanggan" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Pelanggan
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Staff
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="pelanggan">
              <form onSubmit={(e) => handleLogin(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-pelanggan">Email</Label>
                  <Input
                    id="email-pelanggan"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-pelanggan">Password</Label>
                  <Input
                    id="password-pelanggan"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary-500 hover:bg-primary-600" disabled={loading}>
                  {loading ? "Loading..." : "Login sebagai Pelanggan"}
                </Button>
                <p className="text-center text-sm text-charcoal-900/60 dark:text-cream-100/60">
                  Belum punya akun?{" "}
                  <Link href="/register" className="text-primary-500 hover:underline font-medium">
                    Daftar sekarang
                  </Link>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="staff">
              <form onSubmit={(e) => handleLogin(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-staff">Email Staff</Label>
                  <Input
                    id="email-staff"
                    name="email"
                    type="email"
                    placeholder="admin@catering.app"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-staff">Password</Label>
                  <Input
                    id="password-staff"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-terracotta-500 hover:bg-terracotta-600" disabled={loading}>
                  {loading ? "Loading..." : "Login sebagai Staff"}
                </Button>
                <p className="text-center text-xs text-charcoal-900/50 dark:text-cream-100/50 mt-4">
                  Khusus untuk Admin, Owner, dan Kurir
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}