import { auth } from '@/lib/Auth';
import Link from 'next/link';
import SingOutButton from './components/SingOutButton';
const Home = async () => {
  
  interface user{
    id: number,
    username: string,
    }
  const user:any = (await auth())?.user;

  if(user){
    return (
      <main>
        <h1> Dashboard component.</h1>
        <SingOutButton />
        User Email: { JSON.stringify(user.email)}

      </main>
    );
  }
  return (
   <main>
    <h1>Normale Page.</h1>    
    <Link href={"/auth/login"} className='btn btn-primary'> Signin </Link>
   </main>
  );
}

export default Home;