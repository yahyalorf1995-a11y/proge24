import Link from "next/link";
import { logIn } from "@/features/auth/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields: "الرجاء تعبئة الحقلين.",
  invalid_credentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/20 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">مرحبًا بعودتك</CardTitle>
          <CardDescription>سجّل الدخول إلى نظام التشغيل الشخصي الخاص بك.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logIn} className="flex flex-col gap-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                {ERROR_MESSAGES[error] ?? "حدث خطأ ما، الرجاء المحاولة مجددًا."}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" htmlFor="email">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" htmlFor="password">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit" className="w-full mt-2">تسجيل الدخول</Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            ليس لديك حساب؟{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
