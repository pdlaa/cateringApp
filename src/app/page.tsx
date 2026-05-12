"use client"

import { motion } from "framer-motion"
import { ChefHat, Clock, Award, ArrowRight, Utensils, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"

type Paket = {
  id: number
  nama_paket: string
  jenis_enum: string
  kategori_enum: string
  jumlah_pax: number
  harga_paket: number
  deskripsi: string | null
  foto1: string | null
}

export default function HomePage() {
  const [pakets, setPakets] = useState<Paket[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPakets()
  }, [])

  const fetchPakets = async () => {
    try {
      const { data, error } = await supabase
        .from("pakets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6)

      if (error) throw error
      setPakets(data || [])
    } catch (error) {
      console.error("Error fetching pakets:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background dengan overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-100 to-terracotta-50 dark:from-charcoal-900 dark:via-charcoal-900 dark:to-charcoal-800" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-terracotta-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 md:px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 text-sm font-medium mb-6"
              >
                <ChefHat className="w-4 h-4" />
                Premium Catering Service
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl font-bold text-charcoal-900 dark:text-cream-100 leading-tight mb-6">
                Rasa{" "}
                <span className="text-gradient">Autentik</span>{" "}
                untuk Momen Spesial
              </h1>

              <p className="text-lg md:text-xl text-charcoal-900/70 dark:text-cream-100/70 mb-8 leading-relaxed tracking-wide">
                Nikmati hidangan berkualitas premium dengan cita rasa nusantara yang autentik. 
                Siap menghiasi acara pernikahan, rapat, hingga ulang tahun Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  asChild
                  className="bg-primary-500 hover:bg-primary-600 text-cream-100 text-base px-8"
                >
                  <Link href="#menu" className="flex items-center gap-2">
                    Lihat Menu
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  asChild
                  className="border-2 border-charcoal-900/20 hover:bg-charcoal-900/5 text-base"
                >
                  <Link href="/tentang">Pelajari Lebih</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-charcoal-900/10">
                {[
                  { icon: Award, value: "10+", label: "Tahun Pengalaman" },
                  { icon: ChefHat, value: "5000+", label: "Acara Tersaji" },
                  { icon: Clock, value: "24/7", label: "Layanan" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center md:text-left"
                  >
                    <stat.icon className="w-6 h-6 mx-auto md:mx-0 mb-2 text-terracotta-500" />
                    <div className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-cream-100">
                      {stat.value}
                    </div>
                    <div className="text-sm text-charcoal-900/60 dark:text-cream-100/60">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Image/Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                {/* Placeholder untuk gambar hero */}
                <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500 to-gold-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChefHat className="w-32 h-32 text-white/50" />
                </div>
              </div>
              
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-charcoal-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-charcoal-900 dark:text-cream-100">
                      Terpercaya
                    </div>
                    <div className="text-sm text-charcoal-900/60 dark:text-cream-100/60">
                      Rating 4.9/5
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Menu Paket Section - NEW! */}
      <section id="menu" className="py-20 md:py-32 bg-gradient-to-b from-white to-cream-50 dark:from-charcoal-800 dark:to-charcoal-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 hover:bg-terracotta-500/20">
              <Utensils className="w-3 h-3 mr-1" />
              Menu Kami
            </Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-charcoal-900 dark:text-cream-100 mb-4">
              Paket Catering Terbaik
            </h2>
            <p className="text-lg text-charcoal-900/70 dark:text-cream-100/70 max-w-2xl mx-auto">
              Pilih paket yang sesuai dengan kebutuhan acara Anda. Semua paket menggunakan bahan berkualitas premium.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-charcoal-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : pakets.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Utensils className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Belum Ada Paket
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Paket catering akan segera hadir. Stay tuned!
              </p>
            </div>
          ) : (
            /* Paket Cards */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pakets.map((paket, index) => (
                <motion.div
                  key={paket.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white dark:bg-charcoal-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {paket.foto1 ? (
                      <img 
                        src={paket.foto1} 
                        alt={paket.nama_paket}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-terracotta-500 to-gold-500 flex items-center justify-center">
                        <ChefHat className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 dark:bg-charcoal-900/90 text-charcoal-900 dark:text-white backdrop-blur-sm">
                        {paket.jenis_enum}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-terracotta-500 text-terracotta-600">
                        {paket.kategori_enum}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">4.9</span>
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-cream-100 mb-2 line-clamp-1">
                      {paket.nama_paket}
                    </h3>

                    <p className="text-sm text-charcoal-900/60 dark:text-cream-100/60 mb-4 line-clamp-2">
                      {paket.deskripsi || "Paket catering premium dengan cita rasa nusantara yang autentik."}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-terracotta-500" />
                        <span>{paket.jumlah_pax} porsi</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Harga mulai</span>
                        <span className="font-display text-2xl font-bold text-primary-600 dark:text-primary-400">
                          Rp {paket.harga_paket.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <Button 
                        size="sm"
                        asChild
                        className="bg-primary-500 hover:bg-primary-600 text-white"
                      >
                        <Link href={`/paket/${paket.id}`}>
                          Pesan
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* View All Button */}
          {!loading && pakets.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button 
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white"
              >
                <Link href="/menu">
                  Lihat Semua Paket
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white dark:bg-charcoal-800">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-charcoal-900 dark:text-cream-100 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg text-charcoal-900/70 dark:text-cream-100/70 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman kuliner terbaik untuk setiap acara Anda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Bahan Berkualitas",
                description: "Hanya menggunakan bahan segar pilihan dari supplier terpercaya",
                icon: "🥗",
              },
              {
                title: "Chef Profesional",
                description: "Tim chef berpengalaman dengan keahlian memasak tradisional & modern",
                icon: "👨‍🍳",
              },
              {
                title: "Harga Transparan",
                description: "Tidak ada biaya tersembunyi, harga sesuai dengan kualitas",
                icon: "💰",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-cream-100 dark:bg-charcoal-900 border border-cream-200 dark:border-charcoal-700 hover:border-terracotta-500/50 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-display text-xl font-bold text-charcoal-900 dark:text-cream-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-charcoal-900/70 dark:text-cream-100/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}