import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useLocation } from 'wouter'
import { Home, ArrowLeft, AlertCircle } from 'lucide-react'

export function NotFound() {
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardContent className="p-8">
          {/* Icône d'erreur */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          {/* Titre */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            404 Page Not Found
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-8">
            Did you forget to add the page to the router?
          </p>
          
          {/* Boutons */}
          <div className="space-y-3">
            <Button 
              onClick={() => setLocation('/')}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Page précédente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
