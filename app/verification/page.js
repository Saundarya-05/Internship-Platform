"use client";
import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";

export default function VerificationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewerKey, setReviewerKey] = useState("");
  const [notes, setNotes] = useState({});
  const [message, setMessage] = useState("");
  async function load() {
    setLoading(true);
    try { const res = await fetch("/api/internships"); const result = await res.json(); if (!res.ok) throw new Error(result.message); setItems(result.data); }
    catch (error) { setMessage(error.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function review(id, reviewerStatus) {
    setMessage("");
    try {
      const res = await fetch(`/api/verification/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-reviewer-key": reviewerKey }, body: JSON.stringify({ reviewerStatus, reviewerNote: notes[id] || "" }) });
      const result = await res.json(); if (!res.ok) throw new Error(result.message || "Review failed");
      setMessage(`Listing marked as ${reviewerStatus}`); await load();
    } catch (error) { setMessage(error.message); }
  }
  return <div>
    <div className="mb-6"><h1 className="text-3xl font-bold">Verification & Risk</h1><p className="mt-2 text-slate-500">Review automatic risk assessments and record a manual decision.</p></div>
    <div className="mb-6 rounded-xl border bg-white p-5"><h2 className="font-semibold">Reviewer access</h2><p className="my-2 text-sm text-slate-500">Enter the reviewer key configured in your local environment file to approve or reject listings.</p><input type="password" value={reviewerKey} onChange={e => setReviewerKey(e.target.value)} placeholder="Reviewer key" className="w-full max-w-md rounded-lg border px-3 py-2 text-sm" /></div>
    {message && <p className="mb-4 text-sm text-blue-700">{message}</p>}
    {loading ? <p className="text-slate-500">Loading verification records...</p> : items.length === 0 ? <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No internship listings to verify yet.</p> : <div className="space-y-4">{items.map(item => <article key={item._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{item.companyName} – {item.role}</h2><p className="mt-1 text-sm text-slate-500">{item.location} · {item.stipend || "Stipend not disclosed"}</p></div><div className="flex gap-2"><StatusBadge level={item.riskLevel} /><StatusBadge level={item.reviewerStatus} /></div></div><div className="mt-4"><p className="font-semibold">Risk score: {item.riskScore}/100</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{(item.riskReasons || []).map((reason, index) => <li key={index}>{reason}</li>)}</ul></div><textarea value={notes[item._id] ?? item.reviewerNote ?? ""} onChange={e => setNotes({ ...notes, [item._id]: e.target.value })} placeholder="Reviewer note (optional)" rows="2" className="mt-4 w-full rounded-lg border px-3 py-2 text-sm" /><div className="mt-3 flex gap-2"><button onClick={() => review(item._id, "Approved")} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white">Approve</button><button onClick={() => review(item._id, "Rejected")} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Reject</button></div></article>)}</div>}
    <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">Important: This is a rule-based educational risk indicator, not a definitive fraud detector. A reviewer should independently verify company details before making a decision.</p>
  </div>;
}
