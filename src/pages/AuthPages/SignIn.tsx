import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="NICE-ISMO - Sign In"
        description="Sign in to your NICE-ISMO account to access your dashboard and manage your settings."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
