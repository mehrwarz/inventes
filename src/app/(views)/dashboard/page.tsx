import { auth } from '@/lib/Auth';

export default async function Dashboard() {
  const session = await auth();
  return (
    <main>
      Dashboard
      <div>{JSON.stringify(session)}</div>
    </main>
  );
}
