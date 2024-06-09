import { auth } from '@/lib/Auth';
import Link from 'next/link';
import SingOutButton from './components/SingOutButton';
const Home = async () => {
  const session = await auth()

  if(session){
    return (
      <main>
        <h1> Dashboard component.</h1>
        <SingOutButton />
        User Email:
      </main>
    );
  }

  return (
   <main>
    <h1>Normale Page.</h1>
    <Link href={"/login"} className='btn btn-primary'> Signin </Link>
   </main>
  );
}

export default Home;