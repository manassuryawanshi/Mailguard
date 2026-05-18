from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from urllib.parse import urlparse
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
    registered_snippets = set()

    # Helper function to add findings
    def add_finding(snippet, category, reason, severity, weight):
        nonlocal score
        # Avoid duplicate findings on identical snippets
        if snippet.lower() in registered_snippets:
            return
        registered_snippets.add(snippet.lower())
        score += weight
        findings.append(Finding(
            snippet=snippet,
            category=category,
            reason=reason,
            severity=severity
        ))

    # 1. Advanced Brand Impersonation / Domain Typosquatting Analysis (Highly targeted threat type)
    brands = ["netflix", "paypal", "apple", "microsoft", "google", "amazon", "facebook", "instagram", "linkedin", "spotify", "chase", "wellsfargo", "bankofamerica"]
    url_pattern = re.compile(r'(https?://[^\s]+)')
    urls = url_pattern.findall(raw_text)

    for url in urls:
        # Extract and sanitize domain name
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            if ":" in domain:
                domain = domain.split(":")[0]
        except Exception:
            domain = ""

        if domain:
            for brand in brands:
                # If brand name is prominent in email body...
                if brand in email_text:
                    # ...but a link domain mentions the brand without being an official domain
                    if brand in domain:
                        official_suffixes = [
                            f"{brand}.com", f"{brand}.net", f"{brand}.org", 
                            f"{brand}.co.uk", f"{brand}.de", f"{brand}.jp",
                            f"signin.{brand}", f"login.{brand}"
                        ]
                        is_official = any(domain == s or domain.endswith("." + s) for s in official_suffixes)
                        if not is_official:
                            add_finding(
                                url, 
                                "Brand Impersonation", 
                                f"The URL domain '{domain}' mimics the legitimate brand '{brand.capitalize()}' but is hosted on an unofficial server. This is a severe hallmark of phishing/typosquatting.", 
                                "HIGH", 
                                45
                            )

    # 2. Billing, Subscription & Payment Fraud Context (Context-aware parsing)
    payment_cues = {
        "update your payment": {"weight": 25, "reason": "Typical lure designed to redirect victims to a fraudulent credit card harvester."},
        "update your billing": {"weight": 25, "reason": "Prompts payment details updates to harvest billing/banking data."},
        "verify your billing": {"weight": 20, "reason": "Asks for sensitive cardholder verification details under pretense of a lock."},
        "processing your latest payment": {"weight": 25, "reason": "Mimics payment failure/decline notifications to steal credit cards."},
        "issue processing": {"weight": 20, "reason": "Prompts transaction issues to trick user into verifying credentials."},
        "payment failure": {"weight": 20, "reason": "Scams leverage fake transaction declines to scare users into re-entering details."}
    }
    for cue, data in payment_cues.items():
        if cue in email_text:
            add_finding(cue, "Billing / Payment Scam", data["reason"], "HIGH", data["weight"])

    # 3. Financial & BEC (Business Email Compromise) Keywords
    financial_cues = {
        "wire transfer": {"weight": 25, "reason": "Requests for quick, irreversible wire transfers are highly indicative of business fraud."},
        "gift card": {"weight": 25, "reason": "Gift cards are untraceable and a highly preferred medium for social engineers."},
        "bitcoin": {"weight": 30, "reason": "Cryptocurrency transfers are highly common in extortion or ransomware threats."},
        "crypto": {"weight": 20, "reason": "Unsolicited cryptocurrency demands or opportunities indicate extortion/scams."},
        "invoice attached": {"weight": 20, "reason": "Fake invoice references prompt users to open malicious attachments."},
        "payment overdue": {"weight": 20, "reason": "Overdue invoice threat bypasses logical validation."},
        "routing number": {"weight": 25, "reason": "Harvests banking routing coordinates to compromise funds."}
    }
    for cue, data in financial_cues.items():
        if cue in email_text:
            add_finding(cue, "Financial Threat", data["reason"], "HIGH", data["weight"])

    # 4. Advanced Urgency & Timeline Analysis (Regex boundaries)
    deadline_pattern = re.compile(r'\b(?:within|in|next|limit|only|within the next)\s+(?:the\s+)?(?:next\s+)?\d{1,2}\s+(?:hours|days|mins|minutes)\b')
    deadline_matches = deadline_pattern.findall(email_text)
    for match in deadline_matches:
        add_finding(match, "Urgency / Deadline", "Strict, artificial timelines are crafted to induce anxiety and prevent security checks.", "MEDIUM", 25)

    # General Urgency & Intimidation keywords
    urgency_cues = {
        "immediately": {"weight": 15, "reason": "Demands quick action, preventing the victim from verifying the request."},
        "urgent": {"weight": 15, "reason": "A psychological bypass trigger to force rash decision-making."},
        "on hold": {"weight": 25, "reason": "Warning that an account is frozen or on hold creates instant panic and compliance."},
        "suspended": {"weight": 25, "reason": "Threat of account suspension triggers panic and bypassed logic."},
        "final notice": {"weight": 20, "reason": "Creates immediate engagement through finality and intimidation."},
        "action required": {"weight": 15, "reason": "Authoritative prompt commonly used in mass-phishing notifications."}
    }
    for cue, data in urgency_cues.items():
        if cue in email_text:
            add_finding(cue, "Urgency / Intimidation", data["reason"], "HIGH" if data["weight"] >= 25 else "MEDIUM", data["weight"])

    # 5. Credential Harvesting & Safety Prompts
    credential_cues = {
        "verify your account": {"weight": 25, "reason": "Classic hook used to direct victims to a spoofed login page."},
        "password reset": {"weight": 15, "reason": "Unsolicited password resets frequently mask phishing lures."},
        "login attempt": {"weight": 15, "reason": "Fake security warnings designed to steal the credentials they claim are at risk."},
        "click here to login": {"weight": 20, "reason": "Direct embedded login links bypass safety protocols and are dangerous."},
        "unauthorized access": {"weight": 20, "reason": "Fear-tactic warning to trick users into 'securing' their login."}
    }
    for cue, data in credential_cues.items():
        if cue in email_text:
            add_finding(cue, "Credential Theft", data["reason"], "HIGH", data["weight"])

    # 6. Impersonal Greetings
    generic_greetings = ["dear customer", "dear user", "valued customer", "dear sir/madam"]
    for greeting in generic_greetings:
        if greeting in email_text:
            add_finding(greeting, "Impersonal Greeting", "Official brand communications address you by your full name. Generic greetings indicate an automated mass campaign.", "LOW", 10)
            break

    # 7. Advanced URL Security and Reputation Analysis
    for url in urls:
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            if ":" in domain:
                domain = domain.split(":")[0]
        except Exception:
            domain = ""

        if domain:
            # IP Address URL Detection
            ip_url_pattern = re.compile(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
            if ip_url_pattern.search(url):
                add_finding(url, "Malicious Link", "Raw IP addresses are used to hide hostnames and bypass modern domain safety checkers.", "HIGH", 30)
            
            # Non-secure HTTP Check on Transactions/Verification
            elif url.startswith("http://"):
                add_finding(url, "Insecure URL", "Link uses unencrypted HTTP protocol. Secure brands strictly mandate HTTPS for membership or payment pages.", "MEDIUM", 15)
            
            # Suspicious Hostname Keywords
            else:
                suspicious_keywords = ["verify", "update", "billing", "login", "signin", "secure", "support", "membership"]
                domain_has_keyword = any(k in domain for k in suspicious_keywords)
                if domain_has_keyword:
                    add_finding(url, "Suspicious Domain", f"The URL domain '{domain}' utilizes misleading words commonly associated with system portals to trick users.", "HIGH", 25)
                else:
                    add_finding(url, "Embedded Link", "Standard embedded URL. Hover over the link to verify correct origin.", "LOW", 10)

    # 8. Malicious Attachments Parsing
    attachment_pattern = re.compile(r'([\w-]+\.(exe|scr|bat|vbs|zip|rar))\b', re.IGNORECASE)
    matches = attachment_pattern.findall(raw_text)
    for match in matches:
        filename = match[0]
        add_finding(filename, "Suspicious Attachment", f"Unexpected files ending in {match[1]} frequently carry active ransomware or malware packages.", "HIGH", 25)

    # Normalize Score Max Limit
    if score > 100:
        score = 100

    # Dynamic Classification Logic
    category = "LEGITIMATE"
    confidence = "LOW"
    recommendation = "This email appears safe, but always verify the sender's address before clicking any links."
    
    if score >= 75:
        category = "PHISHING"
        confidence = "HIGH"
        recommendation = "CRITICAL: High threat detected. Do not click links, input passwords, or open attachments. Report this immediately."
    elif score >= 40:
        category = "SUSPICIOUS"
        confidence = "MEDIUM"
        recommendation = "WARNING: Proceed with caution. Vague indicators found. Do not enter financial information or personal logins."

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
