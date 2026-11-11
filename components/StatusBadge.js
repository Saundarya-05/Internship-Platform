export default function StatusBadge({ level }) {
  const styles = {
    "Low Risk": "bg-green-100 text-green-700",
    "Medium Risk": "bg-amber-100 text-amber-700",
    "High Risk": "bg-red-100 text-red-700",
    "Approved": "bg-green-100 text-green-700",
    "Rejected": "bg-red-100 text-red-700",
    "Pending": "bg-slate-100 text-slate-700"
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[level] || "bg-slate-100 text-slate-700"}`}>{level}</span>;
}
