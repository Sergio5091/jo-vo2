import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const identitySchema = z.object({
  employeeId: z.string()
    .min(1, "L'ID employé est requis"),
  fullName: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères"),
  firstName: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères"),
  phone: z.string()
    .min(1, "Le téléphone est requis"),
  emergencyName: z.string()
    .min(2, "Le nom du contact d'urgence doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  emergencyPhone: z.string()
    .min(1, "Le téléphone d'urgence est requis"),
})

export type IdentityData = z.infer<typeof identitySchema>

interface StepIdentityProps {
  defaultValues?: Partial<IdentityData>
}

export function StepIdentity({ defaultValues }: StepIdentityProps) {
  const {
    register,
    formState: { errors },
  } = useForm<IdentityData>({
    resolver: zodResolver(identitySchema),
    defaultValues,
  })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">
          Étape 1 sur 4 — Informations personnelles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations principales */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="employeeId">ID Employé *</Label>
            <Input
              id="employeeId"
              placeholder="5485123"
              {...register('employeeId')}
              className={errors.employeeId ? 'border-red-500' : ''}
            />
            {errors.employeeId && (
              <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Nom de famille *</Label>
              <Input
                id="fullName"
                placeholder="KOUASSI"
                {...register('fullName')}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                placeholder="Jean"
                {...register('firstName')}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone mobile *</Label>
            <Input
              id="phone"
              placeholder="+225 0700000000"
              {...register('phone')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Contact urgence */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact d'urgence</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="emergencyName">Nom complet *</Label>
              <Input
                id="emergencyName"
                placeholder="TRAORÉ Marie"
                {...register('emergencyName')}
                className={errors.emergencyName ? 'border-red-500' : ''}
              />
              {errors.emergencyName && (
                <p className="text-red-500 text-sm mt-1">{errors.emergencyName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="emergencyPhone">Téléphone *</Label>
              <Input
                id="emergencyPhone"
                placeholder="+225 0700000000"
                {...register('emergencyPhone')}
                className={errors.emergencyPhone ? 'border-red-500' : ''}
              />
              {errors.emergencyPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone.message}</p>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Vos informations sont traitées de manière strictement confidentielle.
        </p>
      </CardContent>
    </Card>
  )
}
