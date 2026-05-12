"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ArrowLeft, Upload, Package, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

type PaketJenis = "Prasmanan" | "Box"
type PaketKategori = "Pernikahan" | "Selamatan" | "Ulang Tahun" | "Studi Tour" | "Rapat"

interface PaketInput {
  nama_paket: string
  jenis_enum: PaketJenis
  kategori_enum: PaketKategori
  jumlah_pax: number
  harga_paket: number
  deskripsi: string
  foto1: string | null
  foto2: string | null
  foto3: string | null
}

export default function CreatePaketPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fotoPreviews, setFotoPreviews] = useState<(string | null)[]>([null, null, null])
  const supabase = createClient()

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: PaketInput = {
      nama_paket: formData.get("nama_paket") as string,
      jenis_enum: formData.get("jenis_enum") as PaketJenis,
      kategori_enum: formData.get("kategori_enum") as PaketKategori,
      jumlah_pax: parseInt(formData.get("jumlah_pax") as string),
      harga_paket: parseInt(formData.get("harga_paket") as string),
      deskripsi: formData.get("deskripsi") as string,
      foto1: fotoPreviews[0],
      foto2: fotoPreviews[1],
      foto3: fotoPreviews[2],
    }

    try {
      const { error } = await supabase.from("pakets").insert(data)
      if (error) throw error
      toast.success("Paket berhasil ditambahkan")
      router.push("/admin/paket")
    } catch (error) {
      console.error("Error creating paket:", error)
      toast.error("Gagal menambahkan paket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/paket" className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
        </Link>

        <h1 className="text-3xl font-bold mb-8">Tambah Paket Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
          {/* Nama Paket */}
          <div>
            <Label>Nama Paket *</Label>
            <Input name="nama_paket" required placeholder="Contoh: Paket Pernikahan Premium" className="mt-1" />
          </div>

          {/* Jenis Paket - RADIO CARDS */}
          <div>
            <Label>Jenis Paket *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className="cursor-pointer">
                <input type="radio" name="jenis_enum" value="Prasmanan" required className="peer sr-only" />
                <div className="p-4 border-2 border-gray-200 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50">
                  <div className="font-semibold">Prasmanan</div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 mx-auto mt-2 peer-checked:bg-green-500"></div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="jenis_enum" value="Box" className="peer sr-only" />
                <div className="p-4 border-2 border-gray-200 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50">
                  <div className="font-semibold">Box</div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 mx-auto mt-2 peer-checked:bg-green-500"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Kategori - RADIO GRID */}
          <div>
            <Label>Kategori *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {["Pernikahan", "Selamatan", "Ulang Tahun", "Studi Tour", "Rapat"].map((item) => (
                <label key={item} className="cursor-pointer">
                  <input type="radio" name="kategori_enum" value={item} required className="peer sr-only" />
                  <div className="p-3 border-2 border-gray-200 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 text-sm">
                    {item}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Jumlah Pax & Harga */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Jumlah Pax *</Label>
              <Input name="jumlah_pax" type="number" required placeholder="100" className="mt-1" />
            </div>
            <div>
              <Label>Harga Paket (Rp) *</Label>
              <Input name="harga_paket" type="number" required placeholder="150000" className="mt-1" />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <Label>Deskripsi</Label>
            <Textarea name="deskripsi" rows={3} className="mt-1" placeholder="Detail paket..." />
          </div>

          {/* Upload Foto */}
          <div>
            <Label>Upload Foto (3 foto)</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {fotoPreviews[i] ? (
                    <img src={fotoPreviews[i]} alt={`Foto ${i+1}`} className="w-full h-32 object-cover rounded" />
                  ) : (
                    <div className="text-sm text-gray-500">Foto {i+1}</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`foto-${i}`}
                    onChange={(e) => handleFileChange(e, i)}
                  />
                  <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={() => document.getElementById(`foto-${i}`)?.click()}>
                    Upload
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading || uploading}>
              {loading ? "Menyimpan..." : "Simpan Paket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}