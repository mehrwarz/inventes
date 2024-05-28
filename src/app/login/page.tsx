"server-only"
import { cookies } from 'next/headers'
import LoginForm from '../components/LoginForm'

const Login = () => {  
  return (
    <main>
         <LoginForm />
    </main>
  )
}

export default Login
