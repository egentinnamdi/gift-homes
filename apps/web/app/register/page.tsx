import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account - GiftHomes Enugu Real Estate",
  description: "Register for an GiftHomes Enugu account to browse verified properties, connect with agents, and book physical or diaspora virtual inspections.",
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-[#703BF7]/5 blur-3xl pointer-events-none" />

      <div className="relative w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
