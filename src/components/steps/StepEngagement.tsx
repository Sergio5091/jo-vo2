import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { User, Calendar, Shield, FileText } from 'lucide-react'

const engagementSchema = z.object({
  confirmAccuracy: z.boolean().refine((val) => val === true, {
    message: "Vous devez confirmer l'exactitude des informations"
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales"
  })
})

export type EngagementData = z.infer<typeof engagementSchema>

interface StepEngagementProps {
  onNext: (data: EngagementData) => void
  defaultValues?: Partial<EngagementData>
}

export function StepEngagement({ onNext, defaultValues }: StepEngagementProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<EngagementData>({
    resolver: zodResolver(engagementSchema),
    defaultValues
  })

  const onSubmit = (data: EngagementData) => {
    onNext(data)
  }

  const InfoSection = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
      <Icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium text-green-900">{title}</h4>
        <div className="text-sm text-green-600 mt-1">{children}</div>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-green-600">
          Étape 4: Engagement et Soumission
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Récapitulatif */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Récapitulatif de votre candidature</h3>
            <div className="space-y-3">
              <InfoSection 
                icon={User}
                title="Informations personnelles"
              >
                Nom, prénom, téléphone, contact d'urgence
              </InfoSection>
              <InfoSection 
                icon={Calendar}
                title="Disponibilité"
              >
                Date de prise de poste et informations de santé
              </InfoSection>
              <InfoSection 
                icon={Shield}
                title="CNPS"
              >
                Statut CNPS et documents fournis
              </InfoSection>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('confirmAccuracy', { required: true })}
                    className="mt-1 text-green-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Je certifie sur l'honneur que toutes les informations fournies sont exactes et complètes *</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Je m'engage sur l'honneur que toutes les informations mentionnées dans ce formulaire sont exactes et véridiques. Toute fausse déclaration pourrait entraîner le rejet de ma candidature.
                    </p>
                  </div>
                </div>
                {errors.confirmAccuracy && (
                  <span className="text-sm text-red-500 block ml-6">{errors.confirmAccuracy.message}</span>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('acceptTerms', { required: true })}
                    className="mt-1 text-green-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">J'accepte les conditions générales de recrutement et m'engage à respecter les règles de la Société Ivoirienne de Raffinage *</p>
                    <p className="text-sm text-gray-600 mt-1">
                      En soumettant cette candidature, j'accepte les conditions générales de recrutement de la Société Ivoirienne de Raffinage et m'engage à respecter les règles de confidentialité et de traitement des données.
                    </p>
                  </div>
                </div>
                {errors.acceptTerms && (
                  <span className="text-sm text-red-500 block ml-6">{errors.acceptTerms.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t">
            {/* Pas de boutons ici - gérés par FormPage.tsx */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
