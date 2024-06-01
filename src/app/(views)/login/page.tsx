import LoginForm from "@/app/components/LoginForm";
import User from "@/app/models/User"
const Login = async ()=>{
  const user = new User;





const data = await user.where({user_id:2}, '<' );




console.log("page data",data)
  return (
    <div>
      <h1>User table name: { user.table_name()} </h1>
      <h1> {user.errors ? user.errors.message : "No Error"}</h1>
      <LoginForm />
    </div>
  )
}

export default Login
