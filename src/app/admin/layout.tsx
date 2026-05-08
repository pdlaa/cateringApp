import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data } = await supabase.auth.getSession()
  const session = data?.session

  if (!session || !session.user.email) {
    redirect("/login")
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("level, name")
    .eq("email", session.user.email)
    .single()

  if (error || !userData || !userData.level) {
    redirect("/login")
  }

  // ✅ FIX: Pastikan level valid
  const userLevel = userData.level as string
  const userName = userData.name || "Admin"

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar userLevel={userLevel} />
      <div className="flex-1 flex flex-col">
        <AdminHeader userName={userName} userLevel={userLevel} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}