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
import { ArrowLeft, Upload, Package, Image as ImageIcon, CheckCircle2, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

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

  const removeFoto = (index: number) => {
    const newPreviews = [...fotoPreviews]
    newPreviews[index] = null
    setFotoPreviews(newPreviews)
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
      toast.success("🎉 Paket berhasil ditambahkan!")
      router.push("/admin/paket")
    } catch (error) {
      console.error("Error creating paket:", error)
      toast.error("Gagal menambahkan paket")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-terracotta-50 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-800 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/admin/paket" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors mb-4 group"
          >
            <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-shadow">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Kembali ke Daftar Paket</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-terracotta-600 bg-clip-text text-transparent">
                Tambah Paket Baru
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Lengkapi informasi paket catering di bawah ini
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Informasi Dasar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary-500/10 to-terracotta-500/10 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Informasi Dasar
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Paket */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nama_paket" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nama Paket <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="nama_paket" 
                    name="nama_paket" 
                    required 
                    placeholder="Contoh: Paket Pernikahan Premium Gold" 
                    className="h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white/50 dark:bg-gray-700/50"
                  />
                </div>

                {/* Jenis Paket */}
                <div className="space-y-2">
                  <Label htmlFor="jenis_enum" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Jenis Paket <span className="text-red-500">*</span>
                  </Label>
                  <Select name="jenis_enum" required>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white/50 dark:bg-gray-700/50">
                      <SelectValue placeholder="Pilih jenis paket" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prasmanan">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                          Prasmanan
                        </div>
                      </SelectItem>
                      <SelectItem value="Box">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-terracotta-500 rounded-full"></span>
                          Box
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Kategori */}
                <div className="space-y-2">
                  <Label htmlFor="kategori_enum" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Select name="kategori_enum" required>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white/50 dark:bg-gray-700/50">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pernikahan">🎊 Pernikahan</SelectItem>
                      <SelectItem value="Selamatan">🙏 Selamatan</SelectItem>
                      <SelectItem value="Ulang Tahun">🎂 Ulang Tahun</SelectItem>
                      <SelectItem value="Studi Tour">🚌 Studi Tour</SelectItem>
                      <SelectItem value="Rapat">💼 Rapat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Jumlah Pax */}
                <div className="space-y-2">
                  <Label htmlFor="jumlah_pax" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Jumlah Pax (Porsi) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input 
                      id="jumlah_pax" 
                      name="jumlah_pax" 
                      type="number" 
                      required 
                      placeholder="100" 
                      min="1"
                      className="h-12 pl-4 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white/50 dark:bg-gray-700/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      porsi
                    </div>
                  </div>
                </div>

                {/* Harga Paket */}
                <div className="space-y-2">
                  <Label htmlFor="harga_paket" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Harga Paket (Rp) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input 
                      id="harga_paket" 
                      name="harga_paket" 
                      type="number" 
                      required 
                      placeholder="150000" 
                      min="0"
                      className="h-12 pl-4 pr-16 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white/50 dark:bg-gray-700/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      IDR
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="deskripsi" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Deskripsi Paket
                  </Label>
                  <Textarea 
                    id="deskripsi" 
                    name="deskripsi" 
                    placeholder="Deskripsikan detail paket, menu yang termasuk, fasilitas, dan keunggulan paket ini..." 
                    rows={5}
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 transition-all resize-none bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Upload Foto */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-terracotta-500/10 to-primary-500/10 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-terracotta-500 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Upload Foto Paket
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tambahkan foto menarik untuk mempromosikan paket Anda
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Foto {index + 1}
                      </Label>
                      {index === 0 && (
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                          (Wajib)
                        </span>
                      )}
                    </div>
                    
                    <div className="relative group">
                      {fotoPreviews[index] ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative rounded-2xl overflow-hidden border-2 border-primary-500/30 dark:border-primary-400/30 shadow-lg"
                        >
                          <img 
                            src={fotoPreviews[index]} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFoto(index)}
                                className="w-full bg-red-500/90 hover:bg-red-600 text-white"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Hapus Foto
                              </Button>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <div className="p-1.5 bg-green-500 rounded-full shadow-lg">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div 
                          onClick={() => document.getElementById(`foto${index + 1}`)?.click()}
                          className="relative cursor-pointer group/upload"
                        >
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-100 to-terracotta-100 dark:from-primary-900/50 dark:to-terracotta-900/50 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                              <Upload className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {uploading ? "Uploading..." : "Klik untuk upload"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Max 5MB (JPG, PNG)
                            </p>
                          </div>
                          <input
                            id={`foto${index + 1}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, index)}
                            disabled={uploading}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-end pt-4"
          >
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading || uploading}
              className="px-8 py-6 rounded-xl border-2 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading || uploading}
              className="px-8 py-6 rounded-xl bg-gradient-to-r from-primary-500 to-terracotta-500 hover:from-primary-600 hover:to-terracotta-600 text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Simpan Paket</span>
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}