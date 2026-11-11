"use client";
import { useEffect, useState } from "react";
const initialForm = { studentName: "", companyName: "", role: "", rating: "5", outcome: "Completed", feedback: "", internshipId: "" };
const field = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm";

export default function ExperiencesPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  async function loadItems() {
    setLoading(true);
    try { const res = await fetch("/api/experiences"); const data = await res.json(); if (!res.ok) throw new Error(data.message); setItems(data.data); }
    catch (error) { setMessage(error.message); } finally { setLoading(false); }
  }
  useEffect(() => { loadItems(); }, []);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await res.json();
if (!res.ok) {
  throw new Error(
    result.errors
      ? Object.values(result.errors).flat().join(" | ")
      : `${result.message}: ${result.error || ""}`
  );
}
      setMessage("Your experience has been submitted"); setForm(initialForm); await loadItems();
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  }
  return <div>
    <div className="mb-6"><h1 className="text-3xl font-bold">Student Experiences</h1><p className="mt-2 text-slate-500">Share what you learned and help other students make informed decisions.</p></div>
    <form onSubmit={submit} className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Share your internship experience</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={field} name="studentName" placeholder="Your name" value={form.studentName} onChange={change} required />
        <input className={field} name="companyName" placeholder="Company name" value={form.companyName} onChange={change} required />
        <input className={field} name="role" placeholder="Internship role" value={form.role} onChange={change} required />
        <select className={field} name="rating" value={form.rating} onChange={change}><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Very poor</option></select>
        <select className={field} name="outcome" value={form.outcome} onChange={change}><option>Completed</option><option>Selected</option><option>Not selected</option><option>Ongoing</option></select>
        <textarea className={`${field} md:col-span-2`} rows="4" name="feedback" placeholder="Describe your application/interview/work experience (minimum 10 characters)" value={form.feedback} onChange={change} required />
      </div>
      <button disabled={saving} className="mt-4 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Submitting..." : "Submit experience"}</button>
      {message && <p className="mt-3 text-sm text-blue-700">{message}</p>}
    </form>
    <h2 className="mb-4 text-xl font-bold">Experiences shared by students</h2>
    {loading ? <p className="text-slate-500">Loading experiences...</p> : items.length === 0 ? <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No experiences shared yet.</p> : <div className="grid gap-4 md:grid-cols-2">{items.map(item => <article key={item._id} className="rounded-xl border bg-white p-5"><div className="flex justify-between gap-3"><div><h3 className="font-bold">{item.companyName}</h3><p className="text-sm text-slate-500">{item.role}</p></div><span className="text-sm font-semibold text-amber-600">★ {item.rating}/5</span></div><p className="mt-3 text-sm text-slate-700">{item.feedback}</p><div className="mt-4 flex justify-between text-xs text-slate-500"><span>By {item.studentName}</span><span>{item.outcome}</span></div></article>)}</div>}
  </div>;
}
