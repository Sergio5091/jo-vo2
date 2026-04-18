import { useState } from 'react'
import { useLocation } from 'wouter'
import { StepIdentity, type IdentityData } from '@/components/steps/StepIdentity'
import { StepAvailability, type AvailabilityData } from '@/components/steps/StepAvailability'
import { StepCNPS, type CNPSData } from '@/components/steps/StepCNPS'
import { StepEngagement, type EngagementData } from '@/components/steps/StepEngagement'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ArrowLeft, CheckSquare, User, Calendar, CreditCard, CheckSquare as CheckSquareIcon, ChevronRight } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'

interface FormData {
  identity?: IdentityData
  availability?: AvailabilityData
  cnps?: Partial<CNPSData> & {
    cnpsProofFile?: File
    identityCardFile?: File
  }
  engagement?: EngagementData
}

interface CNPSFiles {
  cnpsProofFile?: File
  identityCardFile?: File
}

export function FormPage() {
  const [, setLocation] = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({})
  const [cnpsFiles, setCnpsFiles] = useState<CNPSFiles>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [modalErrors, setModalErrors] = useState<string[]>([])

  const totalSteps = 4

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }))
  }

  const handleFileChange = (files: CNPSFiles) => {
    setCnpsFiles(prev => ({
      ...prev,
      cnpsProofFile: files.cnpsProofFile || prev.cnpsProofFile,
      identityCardFile: files.identityCardFile || prev.identityCardFile
    }))
    
    console.log('📁 Fichiers stockés dans state séparé:')
    console.log('  cnpsProofFile:', files.cnpsProofFile)
    console.log('  cnpsProofFile name:', files.cnpsProofFile?.name)
    console.log('  identityCardFile:', files.identityCardFile)
    console.log('  identityCardFile name:', files.identityCardFile?.name)
  }

  const compressImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Détection du device pour optimisation
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          let maxSize = isMobile ? 400 : 600  // Mobile: 400px, Desktop: 600px
          let quality = isMobile ? 0.2 : 0.3   // Mobile: 20%, Desktop: 30%
          
          // Redimensionnement intelligent en conservant le ratio
          let { width, height } = img
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }
          
          // Création du canvas pour compression
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          // Conversion en base64 avec compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          
          console.log(`Image compressée (${isMobile ? 'Mobile' : 'Desktop'}): ${file.name} - ${(compressedBase64.length / 1024).toFixed(1)}KB`)
          
          resolve(compressedBase64)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const validateCurrentStep = () => {
    const errors: string[] = []
    
    if (currentStep === 1) {
      // Validation étape 1: Identité - Récupération directe depuis le DOM
      const employeeId = (document.getElementById('employeeId') as HTMLInputElement)?.value?.trim()
      const fullName = (document.getElementById('fullName') as HTMLInputElement)?.value?.trim()
      const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value?.trim()
      const phone = (document.getElementById('phone') as HTMLInputElement)?.value?.trim()
      const emergencyName = (document.getElementById('emergencyName') as HTMLInputElement)?.value?.trim()
      const emergencyPhone = (document.getElementById('emergencyPhone') as HTMLInputElement)?.value?.trim()
      
      if (!employeeId) errors.push("L'ID employé est requis")
      if (!fullName) errors.push("Le nom de famille est requis")
      if (!firstName) errors.push("Le prénom est requis")
      if (!phone) errors.push("Le téléphone mobile est requis")
      if (!emergencyName) errors.push("Le nom du contact d'urgence est requis")
      if (!emergencyPhone) errors.push("Le téléphone d'urgence est requis")
      
      // Sauvegarder les données validées
      if (errors.length === 0) {
        updateFormData('identity', {
          employeeId, fullName, firstName, phone, emergencyName, emergencyPhone
        })
      }
    } else if (currentStep === 2) {
      // Validation étape 2: Disponibilité
      const healthIssue = (document.getElementById('healthIssue') as HTMLTextAreaElement)?.value?.trim()
      const availabilityDate = (document.getElementById('availabilityDate') as HTMLInputElement)?.value?.trim()
      
      if (!availabilityDate) errors.push("La date de disponibilité est requise")
      
      // Sauvegarder les données validées
      if (errors.length === 0) {
        updateFormData('availability', {
          healthIssue, availabilityDate
        })
      }
    } else if (currentStep === 3) {
      // Validation étape 3: CNPS
      const cnpsData = formData.cnps
      
      console.log('🔍 DEBUG - Validation étape 3:')
      console.log('  cnpsData:', cnpsData)
      console.log('  cnpsData.hasCnps:', cnpsData?.hasCnps)
      console.log('  cnpsData.cnpsNumber:', cnpsData?.cnpsNumber)
      
      if (!cnpsData?.hasCnps || (cnpsData.hasCnps !== 'oui' && cnpsData.hasCnps !== 'non')) {
        errors.push("Veuillez sélectionner 'Oui' ou 'Non' pour la carte CNPS")
      } else if (cnpsData.hasCnps === 'non') {
        // Pour le cas NON, on vérifie les fichiers uploadés
        const cnpsProofFile = cnpsFiles.cnpsProofFile
        const identityCardFile = cnpsFiles.identityCardFile
        
        console.log('  Cas NON - fichiers:', { cnpsProofFile: !!cnpsProofFile, identityCardFile: !!identityCardFile })
        
        if (!cnpsProofFile) {
          errors.push("Vous devez ajouter la preuve de paiement de 14500 FCFA pour permettre la création de votre carte CNPS avant de continuer")
        }
        if (!identityCardFile) {
          errors.push("Vous devez ajouter votre pièce d'identité pour permettre la création de votre carte CNPS avant de continuer")
        }
      } else if (cnpsData.hasCnps === 'oui') {
        // Pour le cas OUI, TOUJORS considérer comme invalide
        console.log('  Cas OUI - numéro:', cnpsData.cnpsNumber)
        console.log('  Cas OUI - BLOCAGE SYSTÉMATIQUE activé')
        
        // Toujours ajouter une erreur pour le cas OUI
        errors.push("Numéro invalide")
      }
      
      console.log('  Errors finaux:', errors)
      
      // Sauvegarder les données CNPS dans tous les cas
      if (errors.length === 0 && cnpsData) {
        console.log('  Sauvegarde des données CNPS')
        updateFormData('cnps', cnpsData)
      }
    } else if (currentStep === 4) {
      // Validation étape 4: Engagement
      const confirmAccuracy = (document.getElementById('confirmAccuracy') as HTMLInputElement)?.checked
      const acceptTerms = (document.getElementById('acceptTerms') as HTMLInputElement)?.checked
      
      if (!confirmAccuracy) errors.push("Veuillez confirmer l'exactitude des informations fournies")
      if (!acceptTerms) errors.push("Veuillez accepter les conditions générales d'utilisation")
      
      // Sauvegarder les données validées
      if (errors.length === 0) {
        updateFormData('engagement', {
          confirmAccuracy, acceptTerms
        })
      }
    }
    
    // Afficher les erreurs seulement s'il y en a
    if (errors.length > 0) {
      setModalErrors(errors)
      setShowErrorModal(true)
      return false
    } else {
      // Cacher le modal s'il n'y a pas d'erreurs
      setShowErrorModal(false)
      setModalErrors([])
      return true
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      setLocation('/')
    }
  }

  const sendEmail = async () => {
    try {
      console.log('📧 EMAILJS - Début du traitement des images...')
      
      // Récupérer les fichiers directement depuis le state séparé
      const cnpsProofFile = cnpsFiles.cnpsProofFile
      const identityCardFile = cnpsFiles.identityCardFile
      
      console.log('🔍 DEBUG - Fichiers trouvés dans le state séparé:')
      console.log('  cnpsProofFile:', cnpsProofFile)
      console.log('  cnpsProofFile name:', cnpsProofFile?.name)
      console.log('  cnpsProofFile size:', cnpsProofFile?.size)
      console.log('  cnpsProofFile type:', cnpsProofFile?.type)
      console.log('  identityCardFile:', identityCardFile)
      console.log('  identityCardFile name:', identityCardFile?.name)
      console.log('  identityCardFile size:', identityCardFile?.size)
      console.log('  identityCardFile type:', identityCardFile?.type)
      
      // Compression des images en base64
      let cnpsProofBase64 = ""
      let identityCardBase64 = ""
      
      if (cnpsProofFile) {
        console.log('📎 Compression de la preuve CNPS...')
        cnpsProofBase64 = await compressImageToBase64(cnpsProofFile)
        console.log('  cnpsProofBase64 length:', cnpsProofBase64.length)
      }
      
      if (identityCardFile) {
        console.log('📎 Compression de la carte d\'identité...')
        identityCardBase64 = await compressImageToBase64(identityCardFile)
        console.log('  identityCardBase64 length:', identityCardBase64.length)
      }
      
      console.log('📊 EMAILJS - Données préparées pour envoi')
      
      const templateParams = {
        to_email: import.meta.env.VITE_RECIPIENT_EMAIL,
        from_name: `${formData.identity?.firstName} ${formData.identity?.fullName}`,
        from_email: formData.identity?.phone,
        employee_id: formData.identity?.employeeId,
        full_name: formData.identity?.fullName,
        first_name: formData.identity?.firstName,
        phone: formData.identity?.phone,
        emergency_name: formData.identity?.emergencyName,
        emergency_phone: formData.identity?.emergencyPhone,
        health_issue: formData.availability?.healthIssue,
        availability_date: formData.availability?.availabilityDate,
        has_cnps: formData.cnps?.hasCnps,
        cnps_number: formData.cnps?.cnpsNumber,
        accept_terms: formData.engagement?.acceptTerms,
        confirm_accuracy: formData.engagement?.confirmAccuracy,
        
        // IMAGES EN BASE64
        cnps_proof_name: cnpsProofFile?.name || "Aucun fichier",
        cnps_proof_base64: cnpsProofBase64,
        identity_card_name: identityCardFile?.name || "Aucun fichier",
        identity_card_base64: identityCardBase64,
      }

      console.log('📧 EMAILJS - Template Params complets:')
      console.log('  to_email:', templateParams.to_email)
      console.log('  from_name:', templateParams.from_name)
      console.log('  cnps_proof_name:', templateParams.cnps_proof_name)
      console.log('  cnps_proof_base64 exists:', !!templateParams.cnps_proof_base64)
      console.log('  cnps_proof_base64 length:', templateParams.cnps_proof_base64?.length || 0)
      console.log('  cnps_proof_base64 type:', templateParams.cnps_proof_base64?.substring(0, 30) || 'none')
      console.log('  cnps_proof_base64 preview:', templateParams.cnps_proof_base64?.substring(0, 100) + '...')
      console.log('  identity_card_name:', templateParams.identity_card_name)
      console.log('  identity_card_base64 exists:', !!templateParams.identity_card_base64)
      console.log('  identity_card_base64 length:', templateParams.identity_card_base64?.length || 0)
      console.log('  identity_card_base64 type:', templateParams.identity_card_base64?.substring(0, 30) || 'none')
      console.log('  identity_card_base64 preview:', templateParams.identity_card_base64?.substring(0, 100) + '...')
      
      console.log('📧 EMAILJS - Envoi en cours...')
      console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID)
      console.log('Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID)
      console.log('Public Key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
      console.log('Template params object:', JSON.stringify(templateParams, null, 2))

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      
      console.log('✅ EMAILJS - Réponse complète:')
      console.log('  Response:', response)
      console.log('  Status:', response.status)
      console.log('  Text:', response.text)
      console.log('  Response keys:', Object.keys(response))
      console.log('  Response data:', JSON.stringify(response, null, 2))

      console.log('✅ EMAILJS - Email envoyé avec succès !')
      toast.success('Candidature envoyée avec succès!')
      setLocation('/success')
    } catch (error) {
      console.error('❌ EMAILJS - Erreur lors de la soumission:', error)
      toast.error('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.')
      throw error
    }
  }

  const handleSubmit = async (engagementData: EngagementData) => {
    updateFormData('engagement', engagementData)
    
    setIsSubmitting(true)
    try {
      await sendEmail()
      toast.success('Candidature soumise avec succès !')
      setLocation('/success')
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      toast.error('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCnpsChange = (data: Partial<CNPSData>) => {
    setFormData(prev => ({
      ...prev,
      cnps: {
        ...prev.cnps,
        ...data
      }
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepIdentity defaultValues={formData.identity} />
      case 2:
        return <StepAvailability defaultValues={formData.availability} />
      case 3:
        return (
          <StepCNPS 
            defaultValues={formData.cnps} 
            onFileChange={handleFileChange}
            onChange={handleCnpsChange}
          />
        )
      case 4:
        return (
          <StepEngagement
            onNext={handleSubmit}
            defaultValues={formData.engagement}
          />
        )
      default:
        return null
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="w-5 h-5 text-green-600" />
      case 2: return <Calendar className="w-5 h-5 text-green-600" />
      case 3: return <CreditCard className="w-5 h-5 text-green-600" />
      case 4: return <CheckSquareIcon className="w-5 h-5 text-green-600" />
      default: return null
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Identité'
      case 2: return 'Disponibilité'
      case 3: return 'CNPS'
      case 4: return 'Engagement'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.jpeg" 
                alt="SIR Logo" 
                className="h-10 w-auto rounded-lg"
                onError={(e) => {
                  console.error('Erreur de chargement du logo:', e);
                  e.currentTarget.src = '/favicon.svg'; // Fallback
                }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Recrutement 2026
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Stepper visuel */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Ligne de progression */}
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-300 -z-10"></div>
              <div 
                className="absolute left-0 top-5 h-0.5 bg-green-600 -z-10 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              ></div>
              
              {/* Étapes */}
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {getStepIcon(step)}
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep === step ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {getStepTitle(step)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mb-8">
            <Progress value={(currentStep / totalSteps) * 100} />
          </div>

          {/* Step Content */}
          <div className="flex justify-center">
            {renderStep()}
          </div>

          {/* Boutons de navigation - UNIQUEMENT EN BAS */}
          <div className="flex justify-between mt-8">
            {/* Bouton Précédent seulement */}
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Étape précédente
              </Button>
            )}
            
            {/* Espace vide pour centrer */}
            <div className="flex-1"></div>
            
            {currentStep === 4 ? (
              <Button
                onClick={() => handleSubmit(formData.engagement!)}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Soumettre
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // Valider les champs avant de passer à l'étape suivante
                  if (validateCurrentStep()) {
                    setCurrentStep(currentStep + 1)
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: supportrecrut@gmail.com</p>
                <p>WhatsApp/Wave: 2250767554748</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Liens utiles</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={() => setLocation('/form')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Formulaire de candidature
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="p-6">
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900">Envoi de votre candidature...</p>
              <p className="text-sm text-gray-600 mt-2">Veuillez patienter</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal d'erreur */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-auto transform transition-all duration-300 scale-100 opacity-100">
            {/* Header */}
            <div className="bg-red-500 px-4 py-3 rounded-t-xl">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.477V8.523c0-1.81-.953-3.477-2.502-3.477H6.523c-1.81 0-3.477.953-3.477 2.502v6.523c0 1.81.953 3.477 2.502 3.477h13.856c1.54 0 2.502-1.667 2.502-3.477z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Champ requis</h3>
                </div>
              </div>
            </div>
            
            {/* Corps */}
            <div className="p-4">
              <div className="space-y-2">
                {modalErrors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex-shrink-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                ))}
              </div>
              
              {/* Bouton */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 shadow"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
