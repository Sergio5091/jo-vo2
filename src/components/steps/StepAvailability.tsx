import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DollarSign } from 'lucide-react'

const availabilitySchema = z.object({
  healthIssue: z.string().optional(),
  availabilityDate: z.string()
    .min(1, "La date de disponibilité est requise")
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, "La date de disponibilité ne peut pas être dans le passé"),
})

export type AvailabilityData = z.infer<typeof availabilitySchema>

interface StepAvailabilityProps {
  defaultValues?: Partial<AvailabilityData>
}

export function StepAvailability({ defaultValues }: StepAvailabilityProps) {
  const {
    register,
    formState: { errors },
  } = useForm<AvailabilityData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues,
  })

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">
          Étape 2 sur 4 — Date de prise de poste
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Information rémunération */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Information sur la rémunération</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-gray-900 mb-1">Indemnité de stage</p>
              <p className="text-2xl font-bold text-gray-900">40 000 – 80 000 FCFA</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Salaire CDI</p>
              <p className="text-2xl font-bold text-gray-900">100 000 – 250 000 FCFA</p>
            </div>
          </div>
        </div>

        {/* Formulaire de disponibilité */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="healthIssue">Problème de santé (optionnel)</Label>
            <textarea
              id="healthIssue"
              rows={3}
              placeholder="Décrivez brièvement tout problème de santé pertinent..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
              {...register('healthIssue')}
            />
          </div>

          <div>
            <Label htmlFor="availabilityDate">Date de disponibilité *</Label>
            <Input
              id="availabilityDate"
              type="date"
              min={today}
              {...register('availabilityDate')}
              className={errors.availabilityDate ? 'border-red-500' : ''}
            />
            {errors.availabilityDate && (
              <p className="text-red-500 text-sm mt-1">{errors.availabilityDate.message}</p>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Vos informations sont traitées de manière strictement confidentielle.
        </p>
      </CardContent>
    </Card>
  )
}
