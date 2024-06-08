import { signOut } from '@/lib/Auth';

export default function SingOutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit" className='btn btn-primary'>Signout</button>
    </form>
  )
}