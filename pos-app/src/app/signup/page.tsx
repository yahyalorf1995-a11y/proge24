import Link from "next/link";
import { signUp } from "@/features/auth/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, string> = {
  missing_fields: "الرجاء تعبئة كل الحقول المطلوبة.",
  weak_password: "يجب أن تتكوّن كلمة المرور من 8 أحرف على الأقل.",
  email_taken: "يوجد حساب مسجّل بهذا البريد الإلكتروني مسبقًا.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/20 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">أنشئ حسابك</CardTitle>
          <CardDescription>ابدأ ببناء نظام التشغيل الشخصي الخاص بك.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="flex flex-col gap-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                {ERROR_MESSAGES[error] ?? "حدث خطأ ما، الرجاء المحاولة مجددًا."}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" htmlFor="name">الاسم</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
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
                minLength={8}
                autoComplete="new-password"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="text-[11px] text-muted-foreground">8 أحرف على الأقل.</span>
            </div>
            <Button type="submit" className="w-full mt-2">إنشاء الحساب</Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
