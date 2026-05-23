import RegisterForm from "../components/auth/RegisterForm";
import { AuthPageShell } from "../components/auth/AuthShell";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <RegisterForm />
    </AuthPageShell>
  );
}
