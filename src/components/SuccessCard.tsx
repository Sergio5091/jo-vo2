import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useLocation } from 'wouter'
import { CheckCircle, ArrowLeft, Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react'

export function SuccessCard() {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center p-8">
          {/* Icône de succès */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-green-900 mb-4">
            Candidature envoyée avec succès !
          </h1>

          {/* Message */}
          <p className="text-lg text-green-700 mb-6">
            Merci pour votre intérêt pour la Société Ivoirienne de Raffinage.
          </p>
          <p className="text-green-600 mb-8">
            Votre candidature a bien été reçue et sera traitée par notre équipe.
          </p>

          {/* Prochaines étapes */}
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Prochaines étapes</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-green-900">Examen de votre dossier</p>
                  <p className="text-sm text-green-600">Notre équipe examinera votre candidature dans les 48h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-green-900">Entretien téléphonique</p>
                  <p className="text-sm text-green-600">Si votre profil correspond, nous vous contacterons</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-green-900">Décision finale</p>
                  <p className="text-sm text-green-600">Vous recevrez une réponse par email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Support téléphonique</p>
                  <p className="text-sm text-gray-600">supportrecrut@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Support email</p>
                  <p className="text-sm text-gray-600">supportrecrut@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Adresse</p>
                  <p className="text-sm text-gray-600">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
            <Button
              onClick={() => window.location.href = '/form'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Nouvelle candidature
            </Button>
          </div>

          {/* Pied de page */}
          <div className="text-center pt-6 border-t border-green-200">
            <p className="text-sm text-green-600 mb-2">
              Merci pour votre patience et votre intérêt pour la SIR.
            </p>
            <p className="text-xs text-green-500">
              Référence: SIR-RECRUT-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
