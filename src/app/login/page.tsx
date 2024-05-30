"use server"
import LoginForm from '../components/LoginForm'
import User from "@/app/modules/User"

const Login = async() => {  
  const user = new User();
  user.get();
  
return (
  <div>
    <h1>User table name: {user.table()}</h1>
    {user.errors? user.errors.message : "--"};
    <LoginForm />
  </div>
)
  
}

export default Login
