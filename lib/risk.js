export function assessRisk(internship) {
  let score = 0;
  const reasons = [];

  if (internship.registrationFee) {
    score += 50;
    reasons.push("The listing asks candidates to pay a registration or application fee.");
  }
  if (!internship.companyWebsite) {
    score += 20;
    reasons.push("No company website was provided.");
  }
  if (internship.contactEmail) {
    const domain = internship.contactEmail.split("@")[1]?.toLowerCase();
    const freeDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com"];
    if (freeDomains.includes(domain)) {
      score += 20;
      reasons.push("The contact email uses a generic email provider instead of a company domain.");
    }
  } else {
    score += 10;
    reasons.push("No recruiter contact email was provided.");
  }
  if (!/^https:\/\//i.test(internship.applicationLink || "")) {
    score += 10;
    reasons.push("The application link does not use HTTPS.");
  }

  score = Math.min(score, 100);
  const level = score >= 50 ? "High Risk" : score >= 25 ? "Medium Risk" : "Low Risk";
  if (reasons.length === 0) reasons.push("No predefined warning signs were detected. This does not guarantee that the opportunity is genuine.");
  return { riskScore: score, riskLevel: level, riskReasons: reasons };
}
