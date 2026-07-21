import React, { useState, useRef } from 'react'
import { useAuthStore } from '@/presentation/store/auth.store'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Avatar, AvatarFallback } from '@/presentation/components/ui/avatar'
import { Camera, Save, User, Mail, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

function getInitials(username: string): string {
  return username ? username.slice(0, 2).toUpperCase() : 'U'
}

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuthStore()
  
  const [firstName, setFirstName] = useState(user?.first_name || '')
  const [lastName, setLastName] = useState(user?.last_name || '')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar_url || null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 2 MB')
        return
      }
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    
    if (selectedImage) {
      formData.append('avatar', selectedImage)
    }

    try {
      await updateProfile(formData)
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      toast.error('Ocurrió un error al actualizar el perfil')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu información personal y foto de perfil.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Columna Izquierda: Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-40 w-40 border-4 border-background shadow-lg transition-transform duration-300 group-hover:scale-105">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover rounded-full" 
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-4xl font-semibold">
                      {getInitials(user?.username || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Formatos soportados: JPEG, PNG, WebP.<br />Tamaño máximo: 2 MB.
              </p>
            </div>

            {/* Columna Derecha: Datos */}
            <div className="flex-1 space-y-6">
              {/* Información de solo lectura */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Nombre de usuario
                  </Label>
                  <div className="font-medium px-3 py-2 bg-muted/50 rounded-md border border-border/50">
                    {user?.username}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Correo electrónico
                  </Label>
                  <div className="font-medium px-3 py-2 bg-muted/50 rounded-md border border-border/50">
                    {user?.email}
                  </div>
                </div>
              </div>

              {user?.is_staff && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-md border border-amber-200 dark:border-amber-900">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Eres un administrador del sistema (Staff).</span>
                </div>
              )}

              <hr className="border-border" />

              {/* Campos editables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Tu nombre" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Tu apellido" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
