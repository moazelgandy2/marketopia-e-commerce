import { getSession } from "@/lib/session";
import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  const session = await getSession();
  return (
    <div>
      {session && (
        <div>
          <p>Welcome back, {session.user.name}!</p>
          <p>Your session is active.</p>
        </div>
      )}
      {!session && <p>Please log in to continue.</p>}
      <h1>Login Page</h1>
      <LoginForm />
    </div>
  );
}
