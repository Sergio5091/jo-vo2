import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Upload, FileText, CreditCard, X, DollarSign } from 'lucide-react'
import { compressImage } from '@/lib/utils'

const cnpsSchema = z.object({
  hasCnps: z.enum(['oui', 'non']),
  cnpsNumber: z.string().optional(),
  cnpsProof: z.string().optional(),
  cnpsProofName: z.string().optional(),
  identityCard: z.string().optional(),
  identityCardName: z.string().optional()
}).refine((data) => {
  if (data.hasCnps === 'oui') {
    return data.cnpsNumber && data.cnpsNumber.trim() !== ''
  }
  return true
}, {
  message: "Veuillez entrer votre numéro CNPS avant de continuer.",
  path: ['cnpsNumber']
}).refine((data) => {
  if (data.hasCnps === 'non') {
    return data.cnpsProof && data.cnpsProof.trim() !== ''
  }
  return true
}, {
  message: "Vous devez ajouter la preuve de paiement de 14500 FCFA pour permettre la création de votre carte CNPS avant de continuer.",
  path: ['cnpsProof']
}).refine((data) => {
  if (data.hasCnps === 'non') {
    return data.identityCard && data.identityCard.trim() !== ''
  }
  return true
}, {
  message: "Vous devez ajouter votre pièce d'identité pour permettre la création de votre carte CNPS avant de continuer.",
  path: ['identityCard']
})

export type CNPSData = z.infer<typeof cnpsSchema>

interface StepCNPSProps {
  defaultValues?: Partial<CNPSData>
  onChange?: (data: Partial<CNPSData>) => void
  onFileChange?: (files: { cnpsProofFile?: File, identityCardFile?: File }) => void
}

export function StepCNPS({ defaultValues, onChange, onFileChange }: StepCNPSProps) {
  const [cnpsPreview, setCnpsPreview] = useState<string>(defaultValues?.cnpsProof || '')
  const [identityPreview, setIdentityPreview] = useState<string>(defaultValues?.identityCard || '')
  const [uploading, setUploading] = useState<'cnps' | 'identity' | null>(null)
  const [dragging, setDragging] = useState(false)
  const [identityDragging, setIdentityDragging] = useState(false)
  const [cnpsProofFile, setCnpsProofFile] = useState<File>()
  const [identityCardFile, setIdentityCardFile] = useState<File>()

  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CNPSData>({
    resolver: zodResolver(cnpsSchema),
    defaultValues
  })

  const hasCnps = watch('hasCnps')
  const cnpsNumber = watch('cnpsNumber')

  // Transmettre les données quand elles changent
  React.useEffect(() => {
    if (onChange) {
      onChange({
        hasCnps,
        cnpsNumber
      })
    }
  }, [hasCnps, cnpsNumber, onChange])

  const handleFileUpload = async (file: File, type: 'cnps' | 'identity') => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale: 5MB')
      return
    }
    
    // Validation du format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Format de fichier non supporté. Formats acceptés: JPG, PNG, PDF')
      return
    }
    
    setUploading(type)
    
    try {
      let result: string
      
      if (file.type === 'application/pdf') {
        // Pour les PDF, on convertit directement en base64
        result = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
      } else {
        // Pour les images, on compresse
        result = await compressImage(file)
      }
      
      if (type === 'cnps') {
        setCnpsPreview(result)
        setValue('cnpsProof', result)
        setValue('cnpsProofName', file.name)
        setCnpsProofFile(file)
        if (onChange) {
          onChange({ cnpsProof: result, cnpsProofName: file.name })
        }
      } else {
        setIdentityPreview(result)
        setValue('identityCard', result)
        setValue('identityCardName', file.name)
        setIdentityCardFile(file)
        if (onChange) {
          onChange({ identityCard: result, identityCardName: file.name })
        }
      }
      
      // Notifier le parent des fichiers
      if (onFileChange) {
        console.log('📞 Appel de onFileChange avec:', {
          cnpsProofFile: type === 'cnps' ? file : cnpsProofFile,
          identityCardFile: type === 'identity' ? file : identityCardFile
        })
        onFileChange({
          cnpsProofFile: type === 'cnps' ? file : cnpsProofFile,
          identityCardFile: type === 'identity' ? file : identityCardFile
        })
      } else {
        console.log('⚠️ onFileChange non disponible - fichiers non stockés dans le parent')
      }
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error)
      alert('Erreur lors du traitement du fichier')
    } finally {
      setUploading(null)
    }
  }

  const handleDrop = (e: React.DragEvent, type: 'cnps' | 'identity') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file, type)
    }
    if (type === 'cnps') {
      setDragging(false)
    } else {
      setIdentityDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent, type: 'cnps' | 'identity') => {
    e.preventDefault()
    if (type === 'cnps') {
      setDragging(true)
    } else {
      setIdentityDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent, type: 'cnps' | 'identity') => {
    e.preventDefault()
    if (type === 'cnps') {
      setDragging(false)
    } else {
      setIdentityDragging(false)
    }
  }

  const removeFile = (type: 'cnps' | 'identity') => {
    if (type === 'cnps') {
      setCnpsPreview('')
      setValue('cnpsProof', '')
      setValue('cnpsProofName', '')
    } else {
      setIdentityPreview('')
      setValue('identityCard', '')
      setValue('identityCardName', '')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">
          Étape 3 sur 4 — Caisse Nationale de Prévoyance Sociale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question CNPS */}
        <div className="space-y-4">
          <Label>Avez-vous une carte CNPS ? *</Label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="oui"
                {...register('hasCnps')}
                className="text-gray-900"
              />
              <span className={`px-4 py-2 rounded ${hasCnps === 'oui' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>
                OUI
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="non"
                {...register('hasCnps')}
                className="text-gray-900"
              />
              <span className={`px-4 py-2 rounded ${hasCnps === 'non' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}>
                NON
              </span>
            </label>
          </div>
          {errors.hasCnps && (
            <p className="text-red-500 text-sm mt-1">{errors.hasCnps.message}</p>
          )}
        </div>

        {/* CAS 1: A UNE CARTE CNPS */}
        {hasCnps === 'oui' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cnpsNumber">Numéro CNPS *</Label>
              <Input
                id="cnpsNumber"
                placeholder="Ex : CI-2024-00000"
                {...register('cnpsNumber')}
                className={errors.cnpsNumber ? 'border-red-500' : ''}
              />
              {errors.cnpsNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cnpsNumber.message}</p>
              )}
            </div>
          </div>
        )}

        {/* CAS 2: N'A PAS DE CARTE CNPS */}
        {hasCnps === 'non' && (
          <div className="space-y-6">
            {/* Information frais */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="w-6 h-6 text-gray-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Frais de dossier CNPS : 14 500 FCFA</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ces frais correspondent à l'ouverture et au traitement de votre dossier auprès de la Caisse Nationale de Prévoyance Sociale (CNPS) en Côte d'Ivoire.
              </p>
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-medium text-gray-900">Paiement via WhatsApp / Wave :</p>
                <p className="text-lg font-bold text-gray-900">225076755478</p>
              </div>
            </div>

            {/* Preuve de paiement */}
            <div className="space-y-2">
              <Label>📄 Preuve de paiement</Label>
              <div 
                className={`border-2 rounded-lg p-6 transition-colors ${
                  dragging 
                    ? 'border-gray-600 bg-gray-50' 
                    : 'border-dashed border-gray-300 bg-white'
                }`}
                onDrop={(e) => handleDrop(e, 'cnps')}
                onDragOver={(e) => handleDragOver(e, 'cnps')}
                onDragLeave={(e) => handleDragLeave(e, 'cnps')}
              >
                {cnpsPreview ? (
                  <div className="space-y-3">
                    <div className="relative">
                      {cnpsPreview.startsWith('data:image') ? (
                        <img 
                          src={cnpsPreview} 
                          alt="Preuve CNPS" 
                          className="max-h-48 mx-auto rounded"
                          data-preview="cnps"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded" data-preview="cnps">
                          <FileText className="w-8 h-8 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Document PDF</p>
                            <p className="text-sm text-gray-500">
                              {defaultValues?.cnpsProofName || 'document.pdf'}
                            </p>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile('cnps')}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-3">
                      <Upload className="w-12 h-12 text-gray-400" />
                      <span className="text-lg text-gray-600">
                        Glissez fichier ici ou parcourir
                      </span>
                      <span className="text-sm text-gray-500">
                        JPG, PNG ou PDF
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'cnps')
                      }}
                      data-file-type="cnps"
                      className="hidden"
                      disabled={uploading === 'cnps'}
                    />
                  </label>
                )}
                {uploading === 'cnps' && (
                  <div className="text-center text-sm text-blue-600">
                    Traitement en cours...
                  </div>
                )}
                {errors.cnpsProof && (
                  <p className="text-red-500 text-sm mt-1">{errors.cnpsProof.message}</p>
                )}
              </div>
            </div>

            {/* Pièce d'identité */}
            <div className="space-y-2">
              <Label>🆔 Pièce d'identité (Recto/Verso)</Label>
              <div 
                className={`border-2 rounded-lg p-6 transition-colors ${
                  identityDragging 
                    ? 'border-gray-600 bg-gray-50' 
                    : 'border-dashed border-gray-300 bg-white'
                }`}
                onDrop={(e) => handleDrop(e, 'identity')}
                onDragOver={(e) => handleDragOver(e, 'identity')}
                onDragLeave={(e) => handleDragLeave(e, 'identity')}
              >
                {identityPreview ? (
                  <div className="space-y-3">
                    <div className="relative">
                      {identityPreview.startsWith('data:image') ? (
                        <img 
                          src={identityPreview} 
                          alt="Carte d'identité" 
                          className="max-h-48 mx-auto rounded"
                          data-preview="identity"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded" data-preview="identity">
                          <CreditCard className="w-8 h-8 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Document PDF</p>
                            <p className="text-sm text-gray-500">
                              {defaultValues?.identityCardName || 'document.pdf'}
                            </p>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile('identity')}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-3">
                      <CreditCard className="w-12 h-12 text-gray-400" />
                      <span className="text-lg text-gray-600">
                        Glissez fichier ici ou parcourir
                      </span>
                      <span className="text-sm text-gray-500">
                        JPG, PNG ou PDF - Recto/Verso
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'identity')
                      }}
                      data-file-type="identity"
                      className="hidden"
                      disabled={uploading === 'identity'}
                    />
                  </label>
                )}
                {uploading === 'identity' && (
                  <div className="text-center text-sm text-blue-600">
                    Traitement en cours...
                  </div>
                )}
                {errors.identityCard && (
                  <p className="text-red-500 text-sm mt-1">{errors.identityCard.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          Vos informations sont traitées de manière strictement confidentielle.
        </p>
      </CardContent>
    </Card>
  )
}
