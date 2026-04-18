import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useLocation } from 'wouter'
import { Briefcase, Clock, Shield, PenLine, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Upload, FileText, Users, CheckCircle, ArrowRight, Star, TrendingUp } from 'lucide-react'

export function Index() {
  const [, setLocation] = useLocation()
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: Users,
      title: 'Gestion Simplifiée',
      description: 'Processus de recrutement digitalisé et optimisé pour les candidats.'
    },
    {
      icon: Shield,
      title: 'Sécurité des Données',
      description: 'Vos informations sont protégées et traitées avec la plus grande confidentialité.'
    },
    {
      icon: Clock,
      title: 'Suivi en Temps Réel',
      description: 'Suivez l\'état de votre candidature à chaque étape du processus.'
    },
    {
      icon: TrendingUp,
      title: 'Processus Efficace',
      description: 'Évaluation rapide et transparente des candidatures reçues.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
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
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                Recrutement 2026
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Animation fade-in-up */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Félicitations, vous êtes présélectionné(e) !
            </h2>
            <div className="text-lg text-gray-700 max-w-3xl mx-auto space-y-2">
              <p>Vous avez été retenu(e) pour poursuivre le processus de recrutement au</p>
              <p className="font-semibold">Société Ivoirienne de Raffinage.</p>
              <p className="mt-4">Veuillez compléter votre dossier en remplissant le formulaire ci-dessous.</p>
            </div>
            
            {/* Bouton CTA */}
            <div className="mt-8">
              <Button 
                size="lg" 
                onClick={() => setLocation('/form')}
                className="bg-green-600 hover:bg-green-700 text-white"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Postuler maintenant
                <ChevronRight className={`w-4 h-4 ml-2 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Cartes d'information */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Carte 1: Stage professionnel */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Stage professionnel</h3>
                <p className="text-gray-600">Durée de 3 à 6 mois</p>
              </CardContent>
            </Card>

            {/* Carte 2: Inscription rapide */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Inscription rapide</h3>
                <p className="text-gray-600">Formulaire en 4 étapes</p>
              </CardContent>
            </Card>

            {/* Carte 3: Données sécurisées */}
            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Données sécurisées</h3>
                <p className="text-gray-600">Informations strictement confidentielles</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4">
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
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2026 Société Ivoirienne de Raffinage. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
