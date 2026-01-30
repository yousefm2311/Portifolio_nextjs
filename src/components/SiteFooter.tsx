import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-white/60">
        <p>© {new Date().getFullYear()} Yousef. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/apps" className="hover:text-white">Apps</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
