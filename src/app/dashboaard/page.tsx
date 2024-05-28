import AdminDashboard from "@/app/components/admin_user/Dashboard";
import AccessDenied from "../components/restricteds/AccessDenied";
import PrimaryDashboard from "../components/primary_user/Dashboard";
import { getSession } from "next-auth/react";



export default async function Dashboard() {
    const session = await getSession()
    const userRole = session?.user?.role // Assuming 'role' is part of the session object
   
    if (userRole === 'admin') {
      return <AdminDashboard /> // Component for admin users
    } else if (userRole === 'user') {
      return <PrimaryDashboard /> // Component for regular users
    } else {
      return <AccessDenied /> // Component shown for unauthorized access
    }
  }