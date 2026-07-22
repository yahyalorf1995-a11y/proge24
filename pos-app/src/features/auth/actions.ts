"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/session";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const BCRYPT_ROUNDS = 12;

// Rate limit windows/limits. Two keys per action (IP + email) so a single
// attacker can't get more attempts just by rotating which of the two they
// vary, while shared-IP users (offices, NAT, mobile carriers) aren't
// unfairly blocked by the (looser) per-IP limit alone.
const LOGIN_IP_LIMIT = { limit: 20, windowMs: 15 * 60 * 1000 }; // 20 / 15 min per IP
const LOGIN_EMAIL_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 }; // 5 / 15 min per email
const SIGNUP_IP_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 }; // 5 / hour per IP
const SIGNUP_EMAIL_LIMIT = { limit: 3, windowMs: 60 * 60 * 1000 }; // 3 / hour per email

async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function signUp(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";
  const name = ((formData.get("name") as string) || "").trim();

  const ip = await getClientIp();
  const ipCheck = await checkRateLimit(`signup:ip:${ip}`, SIGNUP_IP_LIMIT);
  const emailCheck = email
    ? await checkRateLimit(`signup:email:${email}`, SIGNUP_EMAIL_LIMIT)
    : { allowed: true, remaining: 1, resetAt: 0 };
  if (!ipCheck.allowed || !emailCheck.allowed) {
    // Deliberately reuses the pages' existing generic fallback message
    // (shown whenever the error code isn't in their ERROR_MESSAGES map)
    // instead of adding a new UI string, and avoids revealing to a caller
    // that they've specifically been rate-limited.
    redirect("/signup?error=too_many_attempts");
  }

  if (!email || !password) {
    redirect("/signup?error=missing_fields");
  }
  if (password.length < 8) {
    redirect("/signup?error=weak_password");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=email_taken");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, name: name || null, passwordHash },
  });

  // Bootstrap an empty Identity immediately — the rest of the app assumes
  // every authenticated user already has one (see lib/current-user.ts).
  await prisma.identity.create({ data: { userId: user.id } });

  await setSessionCookie(user.id);
  redirect("/");
}

export async function logIn(formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = (formData.get("password") as string) || "";

  const ip = await getClientIp();
  const ipCheck = await checkRateLimit(`login:ip:${ip}`, LOGIN_IP_LIMIT);
  const emailCheck = email
    ? await checkRateLimit(`login:email:${email}`, LOGIN_EMAIL_LIMIT)
    : { allowed: true, remaining: 1, resetAt: 0 };
  if (!ipCheck.allowed || !emailCheck.allowed) {
    // Same fallback-message trick as signUp above, and for the same
    // reason: don't tell a brute-forcer they've been specifically
    // rate-limited vs. simply guessed wrong — reuses "invalid_credentials"
    // wording rather than a distinguishable new message.
    redirect("/login?error=invalid_credentials");
  }

  if (!email || !password) {
    redirect("/login?error=missing_fields");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/login?error=invalid_credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    redirect("/login?error=invalid_credentials");
  }

  await setSessionCookie(user.id);
  redirect("/");
}

export async function logOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
