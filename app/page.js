
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Internship from "@/models/Internship";
import Experience from "@/models/Experience";

async function getCounts() {
  try {
    await connectDB();
    const [internships, experiences, highRisk] = await Promise.all([
      Internship.countDocuments(), Experience.countDocuments(), Internship.countDocuments({ riskLevel: "High Risk" })
    ]);
    return { internships, experiences, highRisk };
  } catch { return { internships: 0, experiences: 0, highRisk: 0 }; }
}

export default async function Home() {
  const counts = await getCounts();
  const cards = [
    { title: "Internship listings", count: counts.internships, href: "/internships", description: "Explore and manage opportunities" },
    { title: "High-risk listings", count: counts.highRisk, href: "/verification", description: "Review opportunities with warning signs" },
    { title: "Student experiences", count: counts.experiences, href: "/experiences", description: "Learn from other students" }
  ];
  return <div>
    <section className="rounded-2xl bg-blue-700 px-7 py-10 text-white">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">Student Internship Safety Platform</p>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">Is this internship real?</h1>
      <p className="mt-3 max-w-2xl text-blue-100">Explore opportunities, understand potential warning signs and learn from the experiences of fellow students.</p>
      <Link href="/internships" className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-blue-700">Explore internships</Link>
    </section>
    <section className="mt-8 grid gap-5 md:grid-cols-3">
      {cards.map(card => <Link href={card.href} key={card.title} className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><p className="text-sm text-slate-500">{card.title}</p><p className="mt-2 text-3xl font-bold">{card.count}</p><p className="mt-2 text-sm text-slate-500">{card.description}</p></Link>)}
    </section>
    <p className="mt-8 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">Note: Risk scores are based on predefined warning signs. A low-risk score is not a guarantee that an internship is genuine.</p>
  </div>;
}
