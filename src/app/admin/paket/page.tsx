"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { Plus, Package, Pencil, Trash2, Loader2, X } from "lucide-react"
import { toast } from "sonner"

type PaketJenis = "Prasmanan" | "Box"
type PaketKategori = "Pernikahan" | "Selamatan" | "Ulang Tahun" | "Studi Tour" | "Rapat"

type Paket = {
  id: number
  nama_paket: string
  jenis_enum: PaketJenis
  kategori_enum: PaketKategori
  jumlah_pax: number
  harga_paket: number
  deskripsi: string | null
  foto1: string | null
  foto2: string | null
  foto3: string | null
}

export default function PaketListPage() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPaket, setEditingPaket] = useState<Paket | null>(null)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fotoPreviews, setFotoPreviews] = useState<(string | null)[]>([null, null, null])
  
  const supabase = createClient()

  useEffect(() => {
    fetchPakets()
  }, [])

  const fetchPakets = async () => {
    const { data, error } = await supabase
      .from("pakets")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Gagal memuat paket")
    } else {
      setPakets(data || [])
    }
    setLoading(false)
  }

  const handleEdit = (paket: Paket) => {
    setEditingPaket(paket)
    setFotoPreviews([paket.foto1, paket.foto2, paket.foto3])
    setEditDialogOpen(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Foto ${index + 1} terlalu besar (max 5MB)`)
      return
    }

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `pakets/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('paket-fotos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('paket-fotos')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl
      const newPreviews = [...fotoPreviews]
      newPreviews[index] = publicUrl
      setFotoPreviews(newPreviews)

      toast.success(`Foto ${index + 1} berhasil diupload`)
    } catch (error) {
      console.error("Error uploading foto:", error)
      toast.error(`Gagal upload foto ${index + 1}`)
    } finally {
      setUploading(false)
    }
  }

  const removeFoto = (index: number) => {
    const newPreviews = [...fotoPreviews]
    newPreviews[index] = null
    setFotoPreviews(newPreviews)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingPaket) return

    setUpdating(true)

    const formData = new FormData(e.currentTarget)
    const  PaketData = {
      nama_paket: formData.get("nama_paket") as string,
      jenis_enum: formData.get("jenis_enum") as PaketJenis,
      kategori_enum: formData.get("kategori_enum") as PaketKategori,
      jumlah_pax: parseInt(formData.get("jumlah_pax") as string),
      harga_paket: parseInt(formData.get("harga_paket") as string),
      deskripsi: formData.get("deskripsi") as string,
      foto1: fotoPreviews[0],
      foto2: fotoPreviews[1],
      foto3: fotoPreviews[2],
      updated_at: new Date().toISOString(),
    }

    try {
      const { error } = await supabase
        .from("pakets")
        .update(PaketData)
        .eq("id", editingPaket.id)

      if (error) throw error
      toast.success("Paket berhasil diupdate")
      setEditDialogOpen(false)
      fetchPakets()
    } catch (error) {
      console.error("Error updating paket:", error)
      toast.error("Gagal mengupdate paket")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus paket ini?")) return

    const { error } = await supabase.from("pakets").delete().eq("id", id)
    if (error) {
      toast.error("Gagal menghapus paket")
    } else {
      toast.success("Paket berhasil dihapus")
      fetchPakets()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Paket</h1>
          <p className="text-gray-500 mt-1">Daftar semua paket catering yang tersedia</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/paket/create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Paket
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-gray-400 animate-pulse" />
          <p className="text-gray-500 mt-2">Memuat paket...</p>
        </div>
      ) : pakets.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum Ada Paket</h3>
          <p className="text-gray-500 mb-6">Mulai tambahkan paket catering pertama Anda</p>
          <Button asChild>
            <Link href="/admin/paket/create">Tambah Paket Pertama</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Paket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pax</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pakets.map((paket) => (
                  <tr key={paket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{paket.nama_paket}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{paket.jenis_enum}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paket.kategori_enum}</td>
                    <td className="px-6 py-4 text-sm">{paket.jumlah_pax} porsi</td>
                    <td className="px-6 py-4 font-medium">Rp {paket.harga_paket.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(paket)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(paket.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Dialog Modal */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Package className="w-6 h-6 text-green-600" />
              Edit Paket
            </DialogTitle>
            <DialogDescription>
              Update informasi paket catering
            </DialogDescription>
          </DialogHeader>

          {editingPaket && (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-4">
                {/* Nama Paket */}
                <div>
                  <Label>Nama Paket *</Label>
                  <Input 
                    name="nama_paket" 
                    defaultValue={editingPaket.nama_paket}
                    required 
                    className="mt-1" 
                  />
                </div>

                {/* Jenis & Kategori */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Jenis Paket *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <label className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="jenis_enum" 
                          value="Prasmanan" 
                          defaultChecked={editingPaket.jenis_enum === "Prasmanan"}
                          required 
                          className="peer sr-only" 
                        />
                        <div className="p-3 border-2 border-gray-200 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                          <div className="font-medium text-sm">Prasmanan</div>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="jenis_enum" 
                          value="Box" 
                          defaultChecked={editingPaket.jenis_enum === "Box"}
                          required 
                          className="peer sr-only" 
                        />
                        <div className="p-3 border-2 border-gray-200 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                          <div className="font-medium text-sm">Box</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Kategori *</Label>
                    <select 
                      name="kategori_enum" 
                      defaultValue={editingPaket.kategori_enum}
                      required
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="Pernikahan">Pernikahan</option>
                      <option value="Selamatan">Selamatan</option>
                      <option value="Ulang Tahun">Ulang Tahun</option>
                      <option value="Studi Tour">Studi Tour</option>
                      <option value="Rapat">Rapat</option>
                    </select>
                  </div>
                </div>

                {/* Pax & Harga */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Jumlah Pax *</Label>
                    <Input 
                      name="jumlah_pax" 
                      type="number" 
                      defaultValue={editingPaket.jumlah_pax}
                      required 
                      min="1"
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label>Harga (Rp) *</Label>
                    <Input 
                      name="harga_paket" 
                      type="number" 
                      defaultValue={editingPaket.harga_paket}
                      required 
                      min="0"
                      className="mt-1" 
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <Label>Deskripsi</Label>
                  <Textarea 
                    name="deskripsi" 
                    defaultValue={editingPaket.deskripsi || ""}
                    rows={3}
                    className="mt-1" 
                  />
                </div>

                {/* Upload Foto */}
                <div>
                  <Label>Foto Paket</Label>
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                        {fotoPreviews[index] ? (
                          <>
                            <img 
                              src={fotoPreviews[index]} 
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFoto(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="text-xs">Foto {index + 1}</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileChange(e, index)}
                          disabled={uploading}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  disabled={updating || uploading}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={updating || uploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Update Paket"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}