import { getSession } from "@/lib/session";
import { RegisterForm } from "./_components/register-form";

export default async function LoginPage() {
  const session = await getSession();
  return (
    <div>
      {session && (
        <div>
          <p>Register back, {session.user.name}!</p>
          <p>Your session is active.</p>
        </div>
      )}
      {!session && <p>Please log in to continue.</p>}
      <h1>Register Page</h1>
      <RegisterForm />
    </div>
  );
}
