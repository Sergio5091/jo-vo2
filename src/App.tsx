import { Route, Switch } from 'wouter'
import { Index } from '@/pages/Index'
import { FormPage } from '@/pages/FormPage'
import { SuccessCard } from '@/components/SuccessCard'
import { NotFound } from '@/pages/not-found'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/form" component={FormPage} />
        <Route path="/success" component={SuccessCard} />
        <Route path="/:rest*" component={NotFound} />
      </Switch>
      <Toaster position="top-right" />
    </>
  )
}

export default App
