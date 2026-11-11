import Link from "next/link";

const links = [
  ["Dashboard", "/"],
  ["Internships", "/internships"],
  ["Verification", "/verification"],
  ["Experiences", "/experiences"]
];

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-blue-700"><span className="text-slate-700">Internship Check</span></Link>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
          {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-blue-700">{label}</Link>)}
        </div>
      </nav>
    </header>
  );
}
