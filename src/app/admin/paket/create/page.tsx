"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

// ✅ Type definitions sesuai database ENUM
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
    
    // ✅ FIX: Type assertion yang benar sesuai ENUM database
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
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/paket" className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Paket
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Tambah Paket Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Dasar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Informasi Dasar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama_paket">Nama Paket *</Label>
                <Input 
                  id="nama_paket" 
                  name="nama_paket" 
                  required 
                  placeholder="Contoh: Paket Pernikahan Premium" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jenis_enum">Jenis Paket *</Label>
                <Select name="jenis_enum" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prasmanan">Prasmanan</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kategori_enum">Kategori *</Label>
                <Select name="kategori_enum" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pernikahan">Pernikahan</SelectItem>
                    <SelectItem value="Selamatan">Selamatan</SelectItem>
                    <SelectItem value="Ulang Tahun">Ulang Tahun</SelectItem>
                    <SelectItem value="Studi Tour">Studi Tour</SelectItem>
                    <SelectItem value="Rapat">Rapat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jumlah_pax">Jumlah Pax (Porsi) *</Label>
                <Input 
                  id="jumlah_pax" 
                  name="jumlah_pax" 
                  type="number" 
                  required 
                  placeholder="Contoh: 100" 
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="harga_paket">Harga Paket (Rp) *</Label>
              <Input 
                id="harga_paket" 
                name="harga_paket" 
                type="number" 
                required 
                placeholder="Contoh: 150000" 
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea 
                id="deskripsi" 
                name="deskripsi" 
                placeholder="Deskripsi detail paket, menu yang termasuk, fasilitas, dll..." 
                rows={4} 
              />
            </div>
          </div>

          {/* Upload Foto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Foto Paket</h3>
            <p className="text-sm text-gray-500">Upload minimal 1 foto untuk paket ini (max 5MB per foto)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">Foto {index + 1}</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {fotoPreviews[index] ? (
                      <div className="space-y-2">
                        <img 
                          src={fotoPreviews[index]} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newPreviews = [...fotoPreviews]
                            newPreviews[index] = null
                            setFotoPreviews(newPreviews)
                          }}
                          className="w-full text-red-500 hover:text-red-600"
                        >
                          Hapus
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`foto${index + 1}`)?.click()}
                          disabled={uploading}
                        >
                          {uploading ? "Uploading..." : "Pilih Foto"}
                        </Button>
                        <input
                          id={`foto${index + 1}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90" 
              disabled={loading || uploading}
            >
              {loading ? "Menyimpan..." : "Simpan Paket"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading || uploading}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}