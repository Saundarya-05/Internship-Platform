"use client";
import { useEffect, useState } from "react";

const emptyForm = { companyName: "", role: "", stipend: "", location: "", description: "", applicationLink: "", companyWebsite: "", contactEmail: "", registrationFee: false };
const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";


export default function InternshipsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  async function loadItems(query = search) {
    setLoading(true);
    try {
      const res = await fetch(`/api/internships?search=${encodeURIComponent(query)}`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Could not load listings");
      setItems(result.data);
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadItems(""); }, []);

  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

async function handleSubmit(e) {
  e.preventDefault();
  setMessage("");
  setErrors({});

  if (!/^[0-9]+$/.test(form.stipend.trim())) {
    setErrors({
      stipend: "Only numbers are allowed"
    });
    return;
  }
  setSaving(true);
  
    try {
      const res = await fetch(editingId ? `/api/internships/${editingId}` : "/api/internships", {
        method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      const result = await res.json();
      if (!res.ok) {
        const errors = result.errors ? Object.values(result.errors).flat().join(" | ") : result.message;
        throw new Error(errors || "Something went wrong");
      }
      setMessage(editingId ? "Internship updated successfully" : "Internship added successfully");
      setForm(emptyForm); setEditingId(null); await loadItems();
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  }

  function editItem(item) {
    setEditingId(item._id);
    setForm({ companyName: item.companyName, role: item.role, stipend: item.stipend || "", location: item.location, description: item.description, applicationLink: item.applicationLink, companyWebsite: item.companyWebsite || "", contactEmail: item.contactEmail || "", registrationFee: item.registrationFee || false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteItem(id) {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;
    try {
      const res = await fetch(`/api/internships/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setMessage("Internship deleted"); await loadItems();
    } catch (error) { setMessage(error.message); }
  }

  return <div>
    <div className="mb-6"><h1 className="text-3xl font-bold">Internship Listings</h1><p className="mt-2 text-slate-500">Add, explore and manage internship opportunities.</p></div>
    <form onSubmit={handleSubmit} className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{editingId ? "Update internship" : "Add a new internship"}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input className={inputClass} name="companyName" placeholder="Company name" value={form.companyName} onChange={updateField} required />
        <input className={inputClass} name="role" placeholder="Internship role" value={form.role} onChange={updateField} required />
        <div>
  <input
    className={inputClass}
    type="text"
    inputMode="numeric"
    name="stipend"
    placeholder="Stipend (numbers only)"
    value={form.stipend}
    onChange={updateField}
    required
  />

  {errors.stipend && (
    <p className="text-red-500 text-sm mt-1">
      {errors.stipend}
    </p>
  )}
</div>
        <input className={inputClass} name="location" placeholder="Location / Remote" value={form.location} onChange={updateField} required />
        <input className={inputClass} name="applicationLink" type="url" placeholder="Application link (https://...)" value={form.applicationLink} onChange={updateField} required />
        <input className={inputClass} name="companyWebsite" type="url" placeholder="Company website (optional)" value={form.companyWebsite} onChange={updateField} />
        <input className={inputClass} name="contactEmail" type="email" placeholder="Recruiter email (optional)" value={form.contactEmail} onChange={updateField} />
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="registrationFee" checked={form.registrationFee} onChange={updateField} /> Registration/application fee required</label>
        <textarea className={`${inputClass} md:col-span-2`} rows="3" name="description" placeholder="Internship description" value={form.description} onChange={updateField} required />
      </div>
      <div className="mt-4 flex flex-wrap gap-3"><button disabled={saving} className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : editingId ? "Update listing" : "Add listing"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="rounded-lg border px-5 py-2.5 text-sm">Cancel edit</button>}</div>
      {message && <p className="mt-3 text-sm text-blue-700">{message}</p>}
    </form>

    <div className="mb-4 flex flex-col gap-3 sm:flex-row"><input className={`${inputClass} sm:max-w-md`} placeholder="Search company, role or location" value={search} onChange={e => setSearch(e.target.value)} /><button onClick={() => loadItems()} className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold">Search</button><button onClick={() => { setSearch(""); loadItems(""); }} className="rounded-lg border bg-white px-4 py-2 text-sm">Clear</button></div>
    {loading ? <p className="py-8 text-center text-slate-500">Loading internships...</p> : items.length === 0 ? <p className="rounded-xl border bg-white p-8 text-center text-slate-500">No internships found. Add the first listing above.</p> : <div className="grid gap-4 md:grid-cols-2">{items.map(item => <article key={item._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{item.role}</h3><p className="font-medium text-blue-700">{item.companyName}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{item.riskLevel}</span></div><p className="mt-3 text-sm text-slate-600">{item.location} · {item.stipend || "Stipend not disclosed"}</p><p className="mt-3 line-clamp-3 text-sm text-slate-600">{item.description}</p><p className="mt-3 text-xs text-slate-500">Reviewer: {item.reviewerStatus}</p><div className="mt-4 flex flex-wrap gap-2"><a href={item.applicationLink} target="_blank" rel="noreferrer" className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white">Apply</a><button onClick={() => editItem(item)} className="rounded-lg border px-3 py-2 text-sm">Edit</button><button onClick={() => deleteItem(item._id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Delete</button></div></article>)}</div>}
  </div>;
}
