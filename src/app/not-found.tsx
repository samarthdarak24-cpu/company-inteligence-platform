import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo size={30} />
      <p className="mt-6 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--sp-text-subtle)]">
        Page not found
      </p>
      <h1 className="mt-3 max-w-md text-balance text-[26px] font-semibold tracking-[-0.025em]">
        That record isn&apos;t available.
      </h1>
      <p className="mt-2 max-w-sm text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
        The page or organisation number you requested does not exist in this workspace.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link href="/app/search" className={buttonClasses("primary", "md")}>
          Search a company
        </Link>
        <Link href="/" className={buttonClasses("secondary", "md")}>
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
