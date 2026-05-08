import { Package, Users, Truck, DollarSign } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Selamat datang di panel admin Catering App.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Package className="h-4 w-4" />
            <span className="text-sm font-medium">Total Paket</span>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-gray-500">Paket menu aktif</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Pesanan Baru</span>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-gray-500">Menunggu konfirmasi</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Truck className="h-4 w-4" />
            <span className="text-sm font-medium">Pengiriman</span>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-gray-500">Sedang dikirim</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Pendapatan</span>
          </div>
          <div className="text-2xl font-bold">Rp 0</div>
          <p className="text-xs text-gray-500">Bulan ini</p>
        </div>
      </div>
    </div>
  )
}