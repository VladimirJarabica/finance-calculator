import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <nav className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            Finance Calculator
          </Link>
          <Link
            href="/calculator/compound-interest"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Compound Interest
          </Link>
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
