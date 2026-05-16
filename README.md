# MailGuard

Advanced Full-Stack Phishing Detection and Cybersecurity Awareness Platform.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

---

## Live Deployment
The production environment is accessible at: **[mailguardai.vercel.app](https://mailguardai.vercel.app)**

---

## Project Overview

MailGuard is a security-focused web application designed to analyze email payloads for social engineering tactics, technical anomalies, and financial fraud indicators. It utilizes a Python-based analysis engine to provide real-time threat scoring and contextual education for end-users.

### Core Objectives
*   **Automated Threat Detection:** Real-time analysis of email text to identify malicious patterns.
*   **User Awareness:** Contextual breakdown of detected threats to improve cybersecurity literacy.
*   **Modern Web Architecture:** Implementation of a decoupled full-stack architecture using React and FastAPI.

---

## Technical Features

### Interactive Threat Inspector
The platform features an "Anatomy View" that renders raw email payloads with dynamic highlighting. Users can interact with specific segments to view detailed technical breakdowns of the detected threat vectors.

### Multi-Layered Analysis Engine
The Python backend evaluates incoming payloads against several security heuristic layers:
*   **Social Engineering:** Detection of high-pressure urgency and intimidation tactics.
*   **Credential Harvesting:** Identification of fake login prompts and unauthorized account verification lures.
*   **Technical Anomalies:** Detection of raw IP address links, suspicious file extensions, and hidden URL destinations.
*   **Financial Fraud:** Recognition of wire transfer requests, cryptocurrency extortion, and business email compromise (BEC) patterns.

---

## System Architecture

The application is built using a modern, distributed architecture:

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
└─────────────────────────────────────────┘
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

1.  **Frontend (React/Vite):** A glassmorphic, responsive interface hosted on Vercel. It handles the interactive UI, state management, and real-time visualization of threat data.
2.  **Backend (FastAPI):** A high-performance Python API hosted on Render. It executes the core analysis logic and returns structured JSON findings.

---

## Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | React 18, Vite, CSS3 (Modern Design System) |
| **Backend** | Python 3.12, FastAPI, Pydantic |
| **API Server** | Uvicorn (ASGI) |
| **Hosting** | Vercel (Frontend), Render (Backend) |

---

## Local Development Setup

### System Requirements
*   Node.js (v18+)
*   Python (v3.10+)

### Initial Setup
```bash
git clone https://github.com/manassuryawanshi/Mailguard.git
cd Mailguard
```

### Backend Configuration
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Configuration
```bash
# From project root
npm install
npm run dev
```

---

## API Documentation

### POST `/api/analyze`
Executes deep analysis on a provided email payload.

**Payload Specification:**
```json
{
  "text": "string"
}
```

**Schema Definition:**
*   `score`: Integer (0-100) representing the cumulative risk.
*   `category`: Classification (PHISHING, SUSPICIOUS, LEGITIMATE).
*   `findings`: Array of objects containing `snippet`, `category`, `reason`, and `severity`.

---

## Development
This project is authored and maintained by **Manas Suryawanshi**.

[GitHub](https://github.com/manassuryawanshi) | [LinkedIn](https://www.linkedin.com/in/manas-suryawanshi-623473242/)

---

## License
Distributed under the MIT License.
