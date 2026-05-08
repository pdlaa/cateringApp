"use client"  // ← WAJIB ADA DI BARIS PERTAMA!

import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { redirect } from "next/navigation"

export default function AdminHeader({ userName, userLevel }: { userName: string, userLevel: string }) {
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold capitalize">{userLevel} Dashboard</h1>
        <p className="text-sm text-gray-500">Selamat datang, {userName}</p>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </header>
  )
}