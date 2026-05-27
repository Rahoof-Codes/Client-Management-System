import AuthGuard from './components/AuthGuard'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <AuthGuard>
      {(user, profile) => <DashboardPage user={user} profile={profile} />}
    </AuthGuard>
  )
}