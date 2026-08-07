// src/components/UserMenu.tsx
// Server Component that reads Supabase auth state and renders the
// right control: a "Sign in" link for guests, or an avatar dropdown
// for signed-in users with a sign-out action.

import Link from "next/link";
import { User, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function UserMenu() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="hidden h-10 items-center gap-1 rounded-md px-2 text-sm text-fg hover:bg-surface sm:inline-flex"
      >
        <User size={20} />
        <span className="hidden md:inline">Sign in</span>
      </Link>
    );
  }

  // Show a small avatar with the first letter of email (fallback) or
  // display name if we can derive it from the email.
  const initial = (user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="group relative hidden sm:block">
      <button
        type="button"
        aria-label="Account menu"
        className="flex h-10 items-center gap-2 rounded-md px-2 text-sm text-fg hover:bg-surface"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-bold text-white">
          {initial}
        </span>
        <ChevronDown size={14} className="hidden md:inline" />
      </button>

      {/* Hover/focus dropdown */}
      <div
        role="menu"
        className="invisible absolute right-0 top-full z-50 mt-1 w-56 origin-top-right rounded-lg border border-border bg-bg opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs text-text-muted">Signed in as</p>
          <p className="truncate text-sm font-medium text-fg">{user.email}</p>
        </div>
        <ul className="py-1 text-sm">
          <li>
            <Link
              href="/account"
              className="block px-4 py-2 text-fg hover:bg-surface"
            >
              My account
            </Link>
          </li>
          <li>
            <Link
              href="/help/orders"
              className="block px-4 py-2 text-fg hover:bg-surface"
            >
              My orders
            </Link>
          </li>
        </ul>
        <div className="border-t border-border p-1">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
