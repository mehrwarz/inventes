import { auth, signOut } from '@/lib/Auth';
import Link from 'next/link';
import SingOutButton from './components/SingOutButton';

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}
const Header = async () => {
  const session = await auth();

  if(session){
    return (
      <main>
        <h1> Dashboard component.</h1>
        <SingOutButton />
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

export default Header;