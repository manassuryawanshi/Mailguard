from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI()

# Allow CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Finding(BaseModel):
    snippet: str
    category: str
    reason: str
    severity: str

class EmailRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    score: int
    category: str
    confidence: str
    recommendation: str
    findings: list[Finding]

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_email(request: EmailRequest):
    raw_text = request.text
    email_text = raw_text.lower()
    score = 0
    findings = []

    # Helper function to add findings
    def add_finding(snippet, category, reason, severity, weight):
        nonlocal score
        # Ensure we only add a snippet if it actually exists in the raw text (case-insensitive search but returning actual case)
        # To keep it simple, we'll return the lowercased snippet for highlighting, but the frontend will handle case-insensitive matching
        score += weight
        findings.append(Finding(
            snippet=snippet,
            category=category,
            reason=reason,
            severity=severity
        ))

    # 1. Financial & BEC (Business Email Compromise) Cues
    financial_cues = {
        "wire transfer": {"weight": 25, "reason": "Attackers often request irreversible wire transfers to steal funds quickly."},
        "gift card": {"weight": 25, "reason": "Gift cards are untraceable and a common currency for cybercriminals."},
        "bitcoin": {"weight": 30, "reason": "Cryptocurrency requests are highly indicative of extortion or ransomware."},
        "crypto": {"weight": 20, "reason": "Often used in investment scams or extortion demands."},
        "invoice attached": {"weight": 20, "reason": "Fake invoices are used to trick victims into paying fraudulent bills or downloading malware."},
        "payment overdue": {"weight": 20, "reason": "Creates a false sense of urgency regarding financial obligations."},
        "routing number": {"weight": 25, "reason": "Requests for bank routing details are severe indicators of financial fraud."}
    }
    for cue, data in financial_cues.items():
        if cue in email_text:
            add_finding(cue, "Financial Threat", data["reason"], "HIGH", data["weight"])

    # 2. Urgency & Intimidation
    urgency_cues = {
        "immediately": {"weight": 15, "reason": "Forces quick action, preventing the victim from verifying the request."},
        "urgent": {"weight": 15, "reason": "A psychological trigger to bypass rational decision-making."},
        "within 24 hours": {"weight": 20, "reason": "Artificial deadlines are a classic social engineering tactic."},
        "account suspended": {"weight": 25, "reason": "Threatening account loss creates panic and compliance."},
        "final notice": {"weight": 20, "reason": "Intimidation tactic designed to force immediate engagement."},
        "action required": {"weight": 15, "reason": "Vague but authoritative demand often seen in phishing."}
    }
    for cue, data in urgency_cues.items():
        if cue in email_text:
            add_finding(cue, "Urgency / Intimidation", data["reason"], "MEDIUM", data["weight"])

    # 3. Credential Harvesting
    credential_cues = {
        "verify your account": {"weight": 25, "reason": "Common lure to direct victims to a fake login page."},
        "password reset": {"weight": 15, "reason": "Unsolicited password reset requests often lead to credential theft."},
        "login attempt": {"weight": 15, "reason": "Fake security alerts designed to steal the very credentials they claim to protect."},
        "click here to login": {"weight": 20, "reason": "Direct links to login pages in emails are highly suspicious."},
        "unauthorized access": {"weight": 20, "reason": "Fear-based tactic to trick users into 'securing' their account by giving up their password."},
        "update your info": {"weight": 15, "reason": "Generic lure used to harvest personal or financial data."}
    }
    for cue, data in credential_cues.items():
        if cue in email_text:
            add_finding(cue, "Credential Theft", data["reason"], "HIGH", data["weight"])

    # 4. Generic Greetings
    generic_greetings = ["dear customer", "dear user", "valued customer", "dear sir/madam"]
    for greeting in generic_greetings:
        if greeting in email_text:
            add_finding(greeting, "Impersonal Greeting", "Legitimate organizations usually address you by your full name. Generic greetings indicate mass-mailing.", "LOW", 10)
            break # Only score once

    # 5. Advanced URL Analysis
    url_pattern = re.compile(r'(https?://[^\s]+)')
    urls = url_pattern.findall(raw_text)
    for url in urls:
        # Check for IP address URLs (highly suspicious)
        ip_url_pattern = re.compile(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
        if ip_url_pattern.search(url):
            add_finding(url, "Malicious Link", "Raw IP addresses are used instead of domain names to bypass simple security filters and hide the true destination.", "HIGH", 30)
        else:
            add_finding(url, "Embedded Link", "Always hover over links to verify the destination domain matches the sender.", "LOW", 15)

    # 6. Suspicious Attachments Mentioned
    attachment_pattern = re.compile(r'([\w-]+\.(exe|scr|bat|vbs|zip|rar))\b', re.IGNORECASE)
    matches = attachment_pattern.findall(raw_text)
    for match in matches:
        filename = match[0]
        add_finding(filename, "Suspicious Attachment", f"Files ending in {match[1]} can contain executable malware or ransomware payloads.", "HIGH", 25)

    # Normalize Score
    if score > 100:
        score = 100

    # Categorization and Recommendation
    category = "LEGITIMATE"
    confidence = "LOW"
    recommendation = "This email appears safe, but always verify the sender's address before clicking any links."
    
    if score >= 75:
        category = "PHISHING"
        confidence = "HIGH"
        recommendation = "CRITICAL: Do not click any links or download attachments. Report this email to your IT department immediately and delete it."
    elif score >= 40:
        category = "SUSPICIOUS"
        confidence = "MEDIUM"
        recommendation = "WARNING: Proceed with caution. Do not provide passwords or financial information. Contact the sender via a known trusted channel to verify."

    return AnalysisResponse(
        score=score,
        category=category,
        confidence=confidence,
        recommendation=recommendation,
        findings=findings
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
