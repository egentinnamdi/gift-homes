import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata = {
  title: "Choose a New Password - GiftHomes",
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      <div className="relative w-full">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
