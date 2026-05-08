"use client"  // ← WAJIB ADA DI BARIS PERTAMA!

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Users, Truck, LayoutDashboard, CreditCard, BarChart3 } from "lucide-react"

const menuItems = {
  admin: [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/paket", icon: Package, label: "Kelola Paket" },
    { href: "/admin/pesanan", icon: Users, label: "Pesanan" },
    { href: "/admin/pembayaran", icon: CreditCard, label: "Pembayaran" },
  ],
  owner: [
    { href: "/owner", icon: BarChart3, label: "Laporan" },
    { href: "/owner/users", icon: Users, label: "Kelola Staff" },
  ],
  kurir: [
    { href: "/kurir", icon: Truck, label: "Pengiriman" },
    { href: "/kurir/riwayat", icon: LayoutDashboard, label: "Riwayat" },
  ],
}

export default function AdminSidebar({ userLevel }: { userLevel: string }) {
  const pathname = usePathname()
  const items = menuItems[userLevel as keyof typeof menuItems] || menuItems.admin

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">Catering App</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          ← Kembali ke Beranda
        </Link>
      </div>
    </aside>
  )
}