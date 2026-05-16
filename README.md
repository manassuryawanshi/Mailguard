# MailGuard 🛡️

> An AI-powered, full-stack phishing email detection and cybersecurity education platform.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

---

## 🔴 Live Demo
**[mailguardai.vercel.app](https://mailguardai.vercel.app)**

---

## 📌 What is MailGuard?

MailGuard is a full-stack cybersecurity platform that uses a **Python AI Engine** to analyze email text for phishing, social engineering, and malicious content — in real-time.

The platform is built with two goals:
1. **Detection** — Let users paste any email and get an instant, detailed threat score.
2. **Education** — Teach users to identify and understand the psychological and technical tactics attackers use.

---

## ✨ Features

### 🔬 Live Threat Intelligence Report
- Paste any email into the scanner and hit **Analyze Email**.
- The AI engine processes the text in the Python backend and returns structured findings.
- Your email is rendered in an **Interactive Anatomy View** where every threat is highlighted color-coded by severity.
- Click any highlighted word to see the **Threat Inspector** explain exactly why it's dangerous.

### 🧠 Multi-Vector AI Analysis Engine
The Python engine scans for **7 distinct threat categories**:
| Category | Example |
|---|---|
| Financial Threat | "wire transfer", "gift card", "bitcoin" |
| Urgency / Intimidation | "immediately", "account suspended", "final notice" |
| Credential Theft | "verify your account", "password reset", "click here to login" |
| Impersonal Greeting | "dear customer", "valued customer" |
| Embedded Links | Any `http://` URL found in the email |
| Malicious Link | URLs using raw IP addresses instead of domain names |
| Suspicious Attachments | File names ending in `.exe`, `.zip`, `.bat`, `.vbs` etc. |

### 📊 Global Threat Landscape
- Animated stats (3.4B phishing emails sent daily)
- Interactive bar charts showing attack vectors, targeted industries, and platform targets.
- **Live Global Attack Pulse** feed simulating real-time threat activity.

### 🎓 Cybersecurity Education Hub
- **"Anatomy of a Phishing Email"** — an interactive mock email with hoverable red flags that explain attacker tactics.
- Info cards explaining Fake Authority, Social Engineering, and Spear Phishing.
- A **Threat Simulation Quiz** to test your ability to spot attacks.
- Safety tips section with actionable defence practices.

### 👤 Meet the Builder
- Professional profile of the developer with orbiting ring animations and live gradient border effects.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React / Vite Frontend           │
│  (Deployed on Vercel)                   │
│                                         │
│  ┌─────────┐   ┌────────────────────┐   │
│  │ Scanner │──▶│ Analysis UI +      │   │
│  │   UI    │   │ Anatomy Report     │   │
│  └─────────┘   └────────────────────┘   │
│        │                                │
│        │  POST /api/analyze             │
│        ▼                                │
└────────────────────────────────────────-┘
          │  HTTP fetch (JSON)
          ▼
┌─────────────────────────────────────────┐
│      Python FastAPI Backend             │
│  (Deployed on Render)                   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  AI Threat Analysis Engine      │    │
│  │  - Financial cue detection      │    │
│  │  - URL & IP regex scanning      │    │
│  │  - Credential theft patterns    │    │
│  │  - Attachment signature check   │    │
│  │  - Urgency/intimidation flags   │    │
│  └─────────────────────────────────┘    │
│        │                                │
│        │  Returns structured Findings[] │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Vanilla CSS3 (Glassmorphism, CSS Grid, Flexbox, `@property` animations) |
| **Backend** | Python 3.12 + FastAPI |
| **API Server** | Uvicorn (ASGI) |
| **Data Validation** | Pydantic v2 |
| **Frontend Deployment** | Vercel |
| **Backend Deployment** | Render |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Clone the repository
```bash
git clone https://github.com/manassuryawanshi/Mailguard.git
cd Mailguard
```

### 2. Start the Backend (Python FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000`

### 3. Start the Frontend (React + Vite)
In a new terminal from the project root:
```bash
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`

---

## 📡 API Reference

### `POST /api/analyze`
Analyzes email text and returns a detailed threat report.

**Request Body:**
```json
{
  "text": "URGENT! Your bank account has been suspended. Click here immediately..."
}
```

**Response:**
```json
{
  "score": 85,
  "category": "PHISHING",
  "confidence": "HIGH",
  "recommendation": "CRITICAL: Do not click any links...",
  "findings": [
    {
      "snippet": "immediately",
      "category": "Urgency / Intimidation",
      "reason": "Forces quick action, preventing the victim from verifying the request.",
      "severity": "MEDIUM"
    }
  ]
}
```

---

## 📁 Project Structure

```
Mailguard/
├── backend/
│   ├── main.py              # FastAPI app + AI analysis engine
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── App.jsx              # Main React component
│   ├── assets/              # Images and static assets
│   └── index.css            # Global CSS + design system
├── index.html               # App entry point
├── package.json
└── vite.config.js
```

---

## 👨‍💻 Author

**Manas Suryawanshi**

[![GitHub](https://img.shields.io/badge/GitHub-manassuryawanshi-181717?style=for-the-badge&logo=github)](https://github.com/manassuryawanshi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Manas_Suryawanshi-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/manas-suryawanshi-623473242/)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
