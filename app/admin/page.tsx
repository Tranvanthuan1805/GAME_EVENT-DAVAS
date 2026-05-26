import { cookies } from "next/headers";
import { AUTH_COOKIE, isAuthenticated } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  return isAuthenticated(token) ? <Dashboard /> : <LoginForm />;
}
