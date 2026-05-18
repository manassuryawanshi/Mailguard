import React, { useEffect, useState, useRef } from 'react';
import builderPhoto from './assets/manas.png';

const QUIZ_QUESTIONS = [
  {
    question: "Which link is a legitimate PayPal login?",
    options: ["https://secure.paypal.com/login", "http://paypal-secure-login.com"],
    correctIndex: 0,
    explanation: "The first link uses HTTPS and the official paypal.com domain. The second is fake."
  },
  {
    question: "You receive an email from 'support@apple-verify.com'. Is this safe?",
    options: ["Yes, it looks official.", "No, it's a phishing domain."],
    correctIndex: 1,
    explanation: "Legitimate emails end in @apple.com. Attackers buy dash-separated domains to fool you."
  },
  {
    question: "An email says your account is locked and you must click to verify your OTP immediately.",
    options: ["Click it quickly to prevent lockdown.", "Ignore it and check your bank app directly."],
    correctIndex: 1,
    explanation: "Banks never ask for OTPs via a direct email link. Always use the official app."
  },
  {
    question: "A 'System Admin' asks for your password to 'update the database'. What do you do?",
    options: ["Send it immediately.", "Refuse and report to IT."],
    correctIndex: 1,
    explanation: "Admins will never ask for your password. This is a common social engineering tactic."
  },
  {
    question: "You see a link in a LinkedIn message: bit.ly/prize-winner. Is it safe to click?",
    options: ["Maybe, let's see.", "No, short links hide the real destination."],
    correctIndex: 1,
    explanation: "Shortened URLs like bit.ly are frequently used to mask malicious sites."
  },
  {
    question: "An email from your 'Boss' asks for an urgent gift card purchase. Safe?",
    options: ["No, it's 'Business Email Compromise'.", "Yes, he's busy."],
    correctIndex: 0,
    explanation: "This is called BEC (Business Email Compromise). Bosses don't ask employees for gift cards."
  },
  {
    question: "Which of these indicates a secure website in the address bar?",
    options: ["A 'Locked' padlock icon.", "A green background on text."],
    correctIndex: 0,
    explanation: "While not 100% proof, the padlock indicates an encrypted HTTPS connection."
  },
  {
    question: "An email attachment is named 'Invoice_291.zip'. What should you do?",
    options: ["Open it to see the amount.", "Scan it and verify with the sender first."],
    correctIndex: 1,
    explanation: "Zip files can hide executable malware. Always verify unexpected attachments."
  },
  {
    question: "What does '2FA' stand for?",
    options: ["Two-Factor Authentication", "Two-File Access"],
    correctIndex: 0,
    explanation: "2FA adds a second layer of security beyond just your password."
  },
  {
    question: "A website has a slight typo in the name: 'faceb0ok.com'. Safe?",
    options: ["Yes, minor typo.", "No, it's a typosquatting site."],
    correctIndex: 1,
    explanation: "Typosquatting is when hackers register domains similar to popular ones to steal logins."
  }
];

const GRAPH_DATA = {
  industry: [
    { label: "Finance", percent: 28 },
    { label: "SaaS/Tech", percent: 22 },
    { label: "Retail", percent: 16 },
    { label: "Healthcare", percent: 14 },
    { label: "Govt", percent: 11 }
  ],
  vector: [
    { label: "Credentials", percent: 45 },
    { label: "Malware", percent: 25 },
    { label: "Ransomware", percent: 15 },
    { label: "Extortion", percent: 10 },
    { label: "Fake Invoices", percent: 5 }
  ],
  platform: [
    { label: "Mobile", percent: 65 },
    { label: "Desktop", percent: 25 },
    { label: "Tablet", percent: 10 }
  ]
};

const CountUp = ({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            setCount(easeOut * end);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

export default function MailGuardApp() {
  const [theme, setTheme] = useState('dark');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStatus, setQuizStatus] = useState(null); // null, 'correct', 'wrong'
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeGraphTab, setActiveGraphTab] = useState('industry');
  const [animatedWidths, setAnimatedWidths] = useState({});
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMouseAtTop, setIsMouseAtTop] = useState(false);
  const [isHoveringNavbar, setIsHoveringNavbar] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [analysisLogs, setAnalysisLogs] = useState([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // New Anatomy Report State
  const [analyzedEmailText, setAnalyzedEmailText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeFinding, setActiveFinding] = useState(null);
  const [attackFeed, setAttackFeed] = useState([
    { id: 1, city: "London", type: "Phishing Link", time: "Just now" },
    { id: 2, city: "Tokyo", type: "Credential Harvest", time: "2m ago" },
    { id: 3, city: "New York", type: "Malware Download", time: "5m ago" }
  ]);

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Typing Animation State
  const typingWords = ["phishing emails", "malicious links", "fake invoices", "scam messages"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      setIsMouseAtTop(e.clientY < 25); // Trigger zone at the very top
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false); // Scrolling down
      } else {
        setShowNavbar(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isHovered) return;

    const timer = setTimeout(() => {
      const currentWord = typingWords[currentWordIndex];
      
      if (isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setTypingSpeed(70); // Deleting speed
      } else {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        setTypingSpeed(140); // Typing speed
      }

      if (!isDeleting && displayText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2500); // Pause at end of word
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % typingWords.length);
        setTypingSpeed(600); // Pause before typing next word
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, isHovered, typingSpeed]);

  useEffect(() => {
    // Reset widths to 0 to trigger animation
    setAnimatedWidths({});
    
    const timer = setTimeout(() => {
      const activeData = GRAPH_DATA[activeGraphTab];
      const maxPercent = Math.max(...activeData.map(d => d.percent));
      
      const newWidths = {};
      activeData.forEach((item, idx) => {
        newWidths[idx] = (item.percent / maxPercent) * 95;
      });
      setAnimatedWidths(newWidths);
    }, 50);

    return () => clearTimeout(timer);
  }, [activeGraphTab]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const cities = ["San Francisco", "Mumbai", "Paris", "Berlin", "Singapore", "Sydney", "Toronto", "Dubai"];
    const types = ["Credential Harvest", "Phishing Link", "Malicious Attachment", "Social Engineering", "BEC Attack"];
    
    const interval = setInterval(() => {
      const newAttack = {
        id: Date.now(),
        city: cities[Math.floor(Math.random() * cities.length)],
        type: types[Math.floor(Math.random() * types.length)],
        time: "Just now"
      };
      setAttackFeed(prev => [newAttack, ...prev.slice(0, 4)]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const analyzeEmail = async () => {
    const emailInput = document.getElementById("emailInput");
    if (!emailInput) return;
    const email = emailInput.value.toLowerCase();
    if (!email.trim()) return;

    setIsAnalyzing(true);
    setHasAnalyzed(true);
    setAnalysisLogs([]);
    setAnalysisProgress(0);

    const initialLogs = [
      "Initializing AI Threat Engine...",
      "Parsing email headers and metadata...",
      "Scanning for suspicious URL patterns...",
      "Cross-referencing global blacklists...",
      "Analyzing sentiment and urgency cues...",
      "Performing deep content inspection...",
      "Calculating risk score..."
    ];

    let currentLogIndex = 0;
    let animDone = false;
    let fetchDone = false;
    let fetchError = null;
    let responseData = null;

    // Dynamic API Router: Queries the local FastAPI engine during any local testing (Vite port, file://, or local IPs)
    const isLocal = !window.location.hostname.includes("mailguardai.vercel.app");
    const apiUrl = isLocal 
      ? "http://localhost:8000/api/analyze" 
      : "https://mailguard-backend-6mh7.onrender.com/api/analyze";

    // Start background fetch IMMEDIATELY in parallel
    const apiPromise = fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: email }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Backend analysis failed");
        return await res.json();
      })
      .then((data) => {
        responseData = data;
        fetchDone = true;
      })
      .catch((err) => {
        fetchError = err;
        fetchDone = true;
      });

    // Snappy fake terminal animation (140ms per log)
    const logInterval = setInterval(() => {
      if (currentLogIndex < initialLogs.length) {
        setAnalysisLogs(prev => [...prev, initialLogs[currentLogIndex]]);
        setAnalysisProgress(((currentLogIndex + 1) / (initialLogs.length + 2)) * 100);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
        animDone = true;
        checkCompletion();
      }
    }, 50);

    let waitTimer = null;
    let elapsedSeconds = 0;

    const checkCompletion = () => {
      if (animDone && fetchDone) {
        finalizeAnalysis();
      } else if (animDone && !fetchDone) {
        // If logs animation finished but fetch is still pending, display a dynamic warm-up message
        setAnalysisLogs(prev => [
          ...prev,
          "Establishing secure tunnel to cloud intelligence node...",
          "Server cold-start detected. Waking up the engine (takes ~20-30s on Render free hosting)..."
        ]);

        let dotCount = 0;
        waitTimer = setInterval(() => {
          elapsedSeconds += 1;
          dotCount = (dotCount + 1) % 4;
          const dots = ".".repeat(dotCount);
          const baseMsg = `Waiting for server response${dots} [Elapsed: ${elapsedSeconds}s / Est. 30s max]`;

          setAnalysisLogs(prev => {
            const updated = [...prev];
            if (updated.length > 0 && updated[updated.length - 1].startsWith("Waiting for server response")) {
              updated[updated.length - 1] = baseMsg;
            } else {
              updated.push(baseMsg);
            }
            return updated;
          });

          // Smoothly increment progress to keep the UI active
          setAnalysisProgress(prev => Math.min(prev + (98 - prev) * 0.1, 98));

          if (fetchDone) {
            clearInterval(waitTimer);
            finalizeAnalysis();
          }
        }, 1000);
      }
    };

    // Periodically poll for completion if fetch finishes after animDone
    const backupPoll = setInterval(() => {
      if (fetchDone && animDone) {
        clearInterval(backupPoll);
        if (waitTimer) clearInterval(waitTimer);
        finalizeAnalysis();
      }
    }, 100);

    const finalizeAnalysis = () => {
      clearInterval(backupPoll);
      if (waitTimer) clearInterval(waitTimer);

      if (fetchError) {
        setAnalysisLogs(prev => [
          ...prev,
          "❌ Connection error: Threat AI Node failed to respond.",
          "Exiting inspection..."
        ]);
        setAnalysisProgress(100);
        setTimeout(() => {
          setIsAnalyzing(false);
          renderErrorDashboard();
        }, 1000);
      } else if (responseData) {
        setAnalysisLogs(prev => [
          ...prev,
          "✔ AI Threat Analysis complete!",
          "Rendering threat anatomy report..."
        ]);
        setAnalysisProgress(100);
        setTimeout(() => {
          setIsAnalyzing(false);
          renderDashboardData(responseData, email);
        }, 200);
      }
    };

    const renderDashboardData = (data, rawEmail) => {
      setAnalysisResult(data);
      setAnalyzedEmailText(rawEmail);
      setActiveFinding(null);

      const { score, category, confidence } = data;
      const categoryEl = document.getElementById("category");
      if (categoryEl) {
        categoryEl.innerText = category;
        if (category === "PHISHING") {
          categoryEl.style.color = "var(--danger)";
          categoryEl.style.textShadow = "0 0 20px rgba(239, 68, 68, 0.4)";
        } else if (category === "SUSPICIOUS") {
          categoryEl.style.color = "var(--warning)";
          categoryEl.style.textShadow = "0 0 20px rgba(245, 158, 11, 0.4)";
        } else {
          categoryEl.style.color = "var(--success)";
          categoryEl.style.textShadow = "0 0 20px rgba(16, 185, 129, 0.4)";
        }
      }

      const scoreTextEl = document.getElementById("scoreText");
      if (scoreTextEl) scoreTextEl.innerText = `${score}% Risk Score`;

      const confidenceEl = document.getElementById("confidence");
      if (confidenceEl) confidenceEl.innerText = `Detection Confidence: ${confidence}`;

      const scoreBarEl = document.getElementById("scoreBar");
      if (scoreBarEl) scoreBarEl.style.width = `${score}%`;

      const signalsContainer = document.getElementById("detectedSignals");
      if (signalsContainer) {
        signalsContainer.innerHTML = "";
        if (data.findings.length > 0) {
          data.findings.slice(0, 4).forEach((finding) => {
            const div = document.createElement("div");
            div.className = "signal-item fade-in-up";
            div.innerText = `${finding.category}: ${finding.snippet}`;
            signalsContainer.appendChild(div);
          });
        } else {
          const div = document.createElement("div");
          div.className = "signal-item fade-in-up";
          div.innerText = "No common threat indicators detected.";
          signalsContainer.appendChild(div);
        }
      }
    };

    const renderErrorDashboard = () => {
      const categoryEl = document.getElementById("category");
      if (categoryEl) {
        categoryEl.innerText = "ERROR";
        categoryEl.style.color = "var(--danger)";
      }
      const scoreTextEl = document.getElementById("scoreText");
      if (scoreTextEl) scoreTextEl.innerText = "0% Risk Score";

      const confidenceEl = document.getElementById("confidence");
      if (confidenceEl) confidenceEl.innerText = "Detection Confidence: N/A";

      const signalsContainer = document.getElementById("detectedSignals");
      if (signalsContainer) {
        signalsContainer.innerHTML = "<div class='signal-item fade-in-up'>Failed to connect to AI engine. Render free tier cold-started or timed out. Please try again.</div>";
      }
    };
  };

  const handleQuiz = (selectedIndex) => {
    if (quizStatus !== null) return;
    
    const isCorrect = selectedIndex === QUIZ_QUESTIONS[quizIndex].correctIndex;
    if (isCorrect) {
      setQuizStatus('correct');
      setQuizScore(prev => prev + 1);
    } else {
      setQuizStatus('wrong');
    }

    setTimeout(() => {
      setQuizStatus(null);
      if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
        setQuizIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 2500);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizStatus(null);
  };

  const activeData = GRAPH_DATA[activeGraphTab];
  const maxPercent = Math.max(...activeData.map(d => d.percent));

  const getHighlightedElements = () => {
    if (!analyzedEmailText || !analysisResult || analysisResult.findings.length === 0) {
      return <div className="email-body-text" style={{ whiteSpace: 'pre-wrap' }}>{analyzedEmailText || "No email analyzed yet."}</div>;
    }

    let elements = [];
    let matches = [];
    
    // Escape regex function
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    analysisResult.findings.forEach((finding) => {
       const regex = new RegExp(`(${escapeRegExp(finding.snippet)})`, 'gi');
       let match;
       while ((match = regex.exec(analyzedEmailText)) !== null) {
           matches.push({
               start: match.index,
               end: match.index + finding.snippet.length,
               text: match[0],
               finding: finding
           });
       }
    });

    matches.sort((a, b) => a.start - b.start);
    
    let nonOverlappingMatches = [];
    let lastEnd = 0;
    matches.forEach(match => {
        if (match.start >= lastEnd) {
            nonOverlappingMatches.push(match);
            lastEnd = match.end;
        }
    });

    let currentPos = 0;
    nonOverlappingMatches.forEach((match, idx) => {
        if (match.start > currentPos) {
            elements.push(<span key={`text-${idx}`}>{analyzedEmailText.substring(currentPos, match.start)}</span>);
        }
        
        const isSelected = activeFinding && activeFinding.snippet === match.finding.snippet;
        elements.push(
            <span 
                key={`match-${idx}`} 
                className={`anatomy-highlight severity-${match.finding.severity.toLowerCase()} ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveFinding(match.finding)}
            >
                {match.text}
            </span>
        );
        currentPos = match.end;
    });

    if (currentPos < analyzedEmailText.length) {
        elements.push(<span key="text-end">{analyzedEmailText.substring(currentPos)}</span>);
    }

    return <div className="email-body-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{elements}</div>;
  };

  return (
    <div className="app-container">
      {/* Background System */}
      <div className="interactive-bg"></div>
      <div className="bg-pattern"></div>
      <div className="ambient-orbs">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <div className={`navbar-wrapper ${(!showNavbar && !isMouseAtTop && !isHoveringNavbar) ? 'navbar-hidden' : ''}`}>
        <div className="container">
          <nav 
            className="navbar fade-in-up"
            onMouseEnter={() => setIsHoveringNavbar(true)}
            onMouseLeave={() => setIsHoveringNavbar(false)}
          >
            <div className="logo-container">
              <h1 className="nav-logo">MAILGUARD<span className="live-gradient">.</span></h1>
            </div>

            <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              <a href="#scannerSection" onClick={() => setIsMobileMenuOpen(false)}>Scanner</a>
              <a href="#stats" onClick={() => setIsMobileMenuOpen(false)}>Stats</a>
              <a href="#education" onClick={() => setIsMobileMenuOpen(false)}>Learn</a>
              <a href="#learnSection" onClick={() => setIsMobileMenuOpen(false)}>Defend</a>
              <a href="#tips" onClick={() => setIsMobileMenuOpen(false)}>Safety</a>
            </div>

            <div className="nav-action-area">
              <div className="theme-switch-wrapper">
                <label className="theme-switch">
                  <input 
                    type="checkbox" 
                    checked={theme === 'light'} 
                    onChange={toggleTheme} 
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <button 
                className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      <main>
        <section className="container">
          <div className="hero-section">
            <div className="hero-content fade-in-up delay-1">
              <div className="hero-badge">
                Next-Gen Threat Intelligence Engine
              </div>

              <h2 
                className="hero-title"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Detect <span className="typing-wrapper"><span className="text-gradient live-gradient">{displayText}<span className="cursor">|</span></span></span> before they fool you.
              </h2>

              <p className="hero-subtitle">
                Paste suspicious emails into the analyzer and instantly receive a
                phishing classification, scam score, threat indicators, and
                actionable cybersecurity insights.
              </p>

              <div className="button-group">
                <button
                  onClick={() => document.getElementById("tips")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn btn-primary"
                >
                  Test Your Knowledge
                </button>
                <button
                  onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn btn-secondary"
                >
                  Interactive Tutorial
                </button>
              </div>
            </div>

            <div id="scannerSection" className="scanner-wrapper fade-in-up delay-2">
              <div className="glass-panel">
                <div className="scanner-header">
                  <div>
                    <h3>Live Threat Scanner</h3>
                    <p>Real-time phishing detection</p>
                  </div>
                  <div className="status-dot"></div>
                </div>

                <textarea
                  id="emailInput"
                  className="scanner-input"
                  defaultValue={`URGENT!!!\n\nYour bank account has been suspended.\n\nClick here immediately to verify your password:\nhttp://fakebank-login.com\n\nFailure to act now will permanently disable your account.`}
                ></textarea>

                <button 
                  onClick={analyzeEmail} 
                  className="btn btn-primary btn-full"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Email"}
                </button>

                {isAnalyzing && (
                  <div className="analysis-terminal fade-in-up">
                    <div className="terminal-header">
                      <div className="terminal-dot"></div>
                      <span>AI Threat Inspector</span>
                      <span className="terminal-progress">{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="terminal-logs">
                      {analysisLogs.map((log, i) => (
                        <div key={i} className="log-entry">
                          <span className="log-prefix">&gt;</span> {log}
                        </div>
                      ))}
                      <div className="log-cursor">_</div>
                    </div>
                  </div>
                )}

                <div className={`results-container ${isAnalyzing ? 'hidden' : ''}`}>
                  <div className="results-header">
                    <div>
                      <p>Detection Result</p>
                      <h3 className="result-category" id="category">---</h3>
                    </div>
                    <div>
                      <p>AI Detection</p>
                      <p className="result-confidence" id="confidence">---</p>
                    </div>
                  </div>

                  <div className="score-bar-track">
                    <div id="scoreBar" className="score-bar-fill"></div>
                  </div>

                  <div className="score-details">
                    <p className="score-text" id="scoreText">0% Risk Score</p>
                    <div className="threat-badge">Threat Analysis Active</div>
                  </div>

                  <div id="detectedSignals" className="signals-list"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CONTEXTUAL ANATOMY REPORT */}
        {hasAnalyzed && !isAnalyzing && analysisResult && (
          <section id="detailedReport" className="section container fade-in-up">
            <div className="mb-10 text-center">
              <span className="pulse-dot" style={{ display: 'inline-block', marginRight: '8px' }}></span>
              <h2 className="section-title" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>Live Threat Intelligence Report</h2>
              <p className="section-subtitle">
                Click on the <span style={{color: 'var(--danger)'}}>highlighted anomalies</span> in your email below to reveal the AI's contextual analysis in real-time.
              </p>
            </div>

            {analysisResult.findings.some(f => f.category === "Brand Impersonation") && (
              <div className="brand-warning-banner fade-in-up" style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid var(--danger)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                color: 'var(--text-main, #fff)',
                boxShadow: '0 0 25px rgba(239, 68, 68, 0.1)',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>⚠️</span>
                <div>
                  <h4 style={{ color: 'var(--danger)', margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '1.1rem' }}>Critical Brand Impersonation Alert</h4>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Our Threat Intelligence Engine has flagged a typosquatting anomaly. This email references a prominent brand name in its content, but directs you to a highly suspicious, unregistered or lookalike domain. Do not interact with the sender or links.
                  </p>
                </div>
              </div>
            )}

            <div className="anatomy-container">
              {/* Main Email View Pane */}
              <div className="anatomy-email-pane clean-card">
                <div className="anatomy-header">
                  <div className="anatomy-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="anatomy-title">Raw Email Payload</div>
                </div>
                <div className="anatomy-body">
                  {getHighlightedElements()}
                </div>
              </div>

              {/* Side Details Pane */}
              <div className="anatomy-details-pane clean-card">
                <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  Threat Inspector
                </h3>
                
                {activeFinding ? (
                  <div className="finding-details fade-in-up">
                    <div className={`finding-severity badge-${activeFinding.severity.toLowerCase()}`}>
                      {activeFinding.severity} RISK
                    </div>
                    <h4 className="finding-category">{activeFinding.category}</h4>
                    
                    <div className="finding-snippet-box">
                      <span className="finding-snippet-label">Detected String:</span>
                      <code>"{activeFinding.snippet}"</code>
                    </div>

                    <p className="finding-reason">
                      {activeFinding.reason}
                    </p>
                  </div>
                ) : (
                  <div className="finding-empty-state">
                    <div className="empty-icon">🖱️</div>
                    <p>Select a highlighted segment in the email payload to view the AI's contextual breakdown.</p>
                  </div>
                )}

                <div className="anatomy-recommendation">
                  <h4>Verdict & Recommendation</h4>
                  <p>{analysisResult.recommendation}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GLOBAL STATS SECTION */}
        <section id="stats" className="section container fade-in-up delay-3">
          <div className="mb-10 text-center">
            <h2 className="section-title">The Global Threat Landscape</h2>
            <p className="section-subtitle">Phishing is the #1 delivery vehicle for ransomware and data breaches. See the real-world impact.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number"><CountUp end={3.4} suffix="B" decimals={1} /></div>
              <div className="stat-label">Phishing Emails Sent Daily</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><CountUp end={4.2} prefix="$" suffix="B" decimals={1} /></div>
              <div className="stat-label">Lost Annually to Scams</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><CountUp end={21} suffix="%" /></div>
              <div className="stat-label">Click on Malicious Links</div>
            </div>
          </div>

          <div className="clean-card">
            <h3 style={{ textAlign: 'center', color: 'var(--neon-cyan)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Attack Data Visualized</h3>
            
            <div className="chart-tabs">
              <button 
                className={`chart-tab-btn ${activeGraphTab === 'industry' ? 'active' : ''}`}
                onClick={() => setActiveGraphTab('industry')}
              >Targeted Industries</button>
              <button 
                className={`chart-tab-btn ${activeGraphTab === 'vector' ? 'active' : ''}`}
                onClick={() => setActiveGraphTab('vector')}
              >Attack Vectors</button>
              <button 
                className={`chart-tab-btn ${activeGraphTab === 'platform' ? 'active' : ''}`}
                onClick={() => setActiveGraphTab('platform')}
              >Platform Targets</button>
            </div>

            <div className="chart-container">
              {activeData.map((item, idx) => (
                <div className="chart-bar-wrapper" key={`${activeGraphTab}-${idx}`}>
                  <div className="chart-label">{item.label}</div>
                  <div className="chart-bar-container">
                    <div className="chart-bar" style={{ width: `${animatedWidths[idx] || 0}%` }}></div>
                    <div className="chart-tooltip">{item.percent}% Attacks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="attack-feed-wrapper">
            <h3 className="feed-title">
              <span className="pulse-dot"></span> Global Attack Pulse (Live)
            </h3>
            <div className="attack-feed">
              {attackFeed.map((attack) => (
                <div key={attack.id} className="attack-item fade-in-right">
                  <span className="attack-time">{attack.time}</span>
                  <span className="attack-city">{attack.city}</span>
                  <span className="attack-type">{attack.type}</span>
                  <span className="attack-status">Blocked</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE EMAIL ANATOMY */}
        <section id="education" className="section container text-center fade-in-up">
          <div className="mb-10">
            <h2 className="section-title">Anatomy of a Phishing Email</h2>
            <p className="section-subtitle">
              Hover over the highlighted <span style={{color: 'var(--danger)'}}>red flags</span> in the mock email below to learn how attackers manipulate you.
            </p>
          </div>

          <div className="mock-email-container" style={{maxWidth: '65.625rem', margin: '0 auto'}}>
            <div className="window-top-bar">
              <div className="window-controls">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
              </div>
            </div>
            
            <div className="window-content-wrapper">
              <div className="email-sidebar">
                <div className="sidebar-item active">Inbox (1)</div>
                <div className="sidebar-item">Sent</div>
                <div className="sidebar-item">Drafts</div>
                <div className="sidebar-item">Archive</div>
                <div className="sidebar-item">Spam</div>
                <div className="sidebar-item">Trash</div>
              </div>
              
              <div className="email-main-view">
                <div className="mock-email-header">
                  <p><strong>From:</strong> <span className="red-flag">security@paypal-update-center.com<span className="tooltip"><strong>Fake Sender Domain:</strong> Attackers often use domains that look similar to the real one, but contain extra words like "update", "center", or use dashes.</span></span></p>
                  <p><strong>To:</strong> customer@email.com</p>
                  <p><strong>Subject:</strong> <span className="red-flag">URGENT: Your account will be locked in 24 hours<span className="tooltip"><strong>Urgency Tactics:</strong> Creating a false sense of panic or urgency forces you to act quickly without verifying the source.</span></span></p>
                </div>
                <div className="mock-email-body">
                  <p><span className="red-flag">Dear Customer,<span className="tooltip"><strong>Generic Greeting:</strong> Legitimate organizations usually address you by your full name, not a generic "Customer" or "User".</span></span></p>
                  <br />
                  <p>We detected unusual activity on your account. To prevent a permanent suspension, you must verify your identity immediately.</p>
                  <br />
                  <p>Please click the secure link below to log in and confirm your details:</p>
                  <p><span className="red-flag" style={{color: 'var(--neon-cyan)', cursor: 'pointer', textDecoration: 'underline'}}>http://paypal.account-verify.net/login<span className="tooltip"><strong>Malicious Link:</strong> The link does not go to the official website. Always check the URL before clicking or entering credentials.</span></span></p>
                  <br />
                  <p>Thank you,</p>
                  <p>The Security Team</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ELEGANT STATIC INFO CARDS */}
        <section id="learnSection" className="section container fade-in-up">
          <div className="mb-10 text-center">
            <span className="label-mini">Cybersecurity Awareness Hub</span>
            <h2 className="section-title">Common Attacker Tactics</h2>
            <p className="section-subtitle">Understanding the hidden mechanics behind modern phishing attacks.</p>
          </div>

          <div className="grid-3 mb-10">
            <div className="clean-card info-card card-cyan">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3>Fake Authority</h3>
              <p>Attackers imitate banks, companies, streaming services, delivery platforms, or your workplace to appear trustworthy. They steal logos and format their emails to look exactly like the real organization, hoping you won't double-check the sender address.</p>
            </div>

            <div className="clean-card info-card card-blue">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3>Psychological Pressure</h3>
              <p>Phishing relies heavily on urgency, fear, panic, fake rewards, or account suspension threats. When humans panic, they are significantly more likely to ignore obvious red flags and click malicious links without thinking critically.</p>
            </div>

            <div className="clean-card info-card card-violet">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3>Credential Harvesting</h3>
              <p>The ultimate goal is often to steal your login credentials or One-Time Passwords (OTPs). Once obtained, stolen passwords are used for financial fraud, identity theft, and large-scale data breaches across multiple connected platforms.</p>
            </div>
          </div>
        </section>

        {/* MULTI-QUESTION QUIZ & TIPS */}
        <section id="tips" className="section container fade-in-up">
          <div className="text-center mb-10">
            <span className="label-mini">Interactive Simulator</span>
            <h2 className="section-title">Test Your <span className="gradient-text">Cyber Instincts</span></h2>
            <p className="section-subtitle">A high-stakes simulator to see if you can survive the modern threat landscape.</p>
          </div>
          <div className="clean-card" style={{padding: '3rem'}}>
            <div className="grid-2">
              <div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Challenge: Spot the Phish</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.8' }}>
                  Test your awareness in real-world scenarios. See if you can identify the malicious attempt.
                </p>
                
                <div className="quiz-container">
                  {!quizFinished ? (
                    <>
                      <div className="quiz-progress-track">
                        <div className="quiz-progress-fill" style={{width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`}}></div>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600}}>
                        <span>QUESTION {quizIndex + 1} OF {QUIZ_QUESTIONS.length}</span>
                        <span>SCORE: {quizScore}</span>
                      </div>
                      <h3 style={{marginBottom: '2rem', fontSize: '1.5rem'}}>{QUIZ_QUESTIONS[quizIndex].question}</h3>
                      <div className="quiz-options">
                        {QUIZ_QUESTIONS[quizIndex].options.map((option, index) => (
                          <button 
                            key={index}
                            className={`quiz-btn ${quizStatus && index === QUIZ_QUESTIONS[quizIndex].correctIndex ? 'correct' : quizStatus && index !== QUIZ_QUESTIONS[quizIndex].correctIndex && quizStatus === 'wrong' ? 'wrong' : ''}`}
                            onClick={() => handleQuiz(index)}
                            disabled={quizStatus !== null}
                          >
                            <span className="option-prefix">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                          </button>
                        ))}
                      </div>
                      <div className={`quiz-feedback ${quizStatus === 'correct' ? 'success' : quizStatus === 'wrong' ? 'error' : ''}`}>
                        {quizStatus !== null && (
                          <div className="fade-in-up">
                            <strong>{quizStatus === 'correct' ? "Correct!" : "Incorrect!"}</strong> {QUIZ_QUESTIONS[quizIndex].explanation}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="fade-in-up">
                      <h3 style={{fontSize: '2rem', color: 'var(--neon-cyan)', marginBottom: '1rem'}}>Quiz Complete!</h3>
                      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>You scored {quizScore} out of {QUIZ_QUESTIONS.length}.</p>
                      <button onClick={resetQuiz} className="btn btn-primary">Play Again</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="tips-list">
                <h3 style={{color: 'var(--neon-cyan)', marginBottom: '1.5rem', fontSize: '1.8rem'}}>Crucial Safety Rules</h3>
                <div className="signal-item" style={{marginBottom: '1rem'}}>
                  <strong>1. Stop and Think:</strong> Do not click suspicious links or download unknown attachments immediately. Always take a deep breath.
                </div>
                <div className="signal-item" style={{marginBottom: '1rem'}}>
                  <strong>2. Verify Sender:</strong> Check the actual email address, not just the display name, carefully before responding.
                </div>
                <div className="signal-item" style={{marginBottom: '1rem'}}>
                  <strong>3. Use 2FA:</strong> Enable two-factor authentication (2FA) for all your important accounts to add an extra layer of defense.
                </div>
                <div className="signal-item">
                  <strong>4. Report it:</strong> Report phishing emails to your email provider or internal cybersecurity team so they can block it.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section container mb-6 fade-in-up">
          <div className="clean-card text-center" style={{ padding: '3rem' }}>
            <span className="label-mini">Project Architect</span>
            <h2 className="section-title" style={{ marginBottom: '2rem' }}>Meet the Builder</h2>
            <p className="section-subtitle mb-6" style={{ maxWidth: 'none' }}>
              Built with a singular focus: to transform complex cybersecurity into 
              an intuitive human experience.
            </p>

            <div id="teamSection" className="builder-container">
              <div className="builder-card">
                <div className="builder-avatar-wrapper">
                  <div className="builder-avatar">
                    <img src={builderPhoto} alt="Manas Suryawanshi" />
                  </div>
                </div>
                <div className="builder-info">
                  <span className="builder-label">Lead Architect & Developer</span>
                  <h3 className="live-gradient">Manas Suryawanshi</h3>
                  <p>
                    A visionary designer and engineer focused on the intersection of 
                    AI and Cybersecurity. Manas designed and built the entire MailGuard 
                    ecosystem to empower users with intelligent threat detection and 
                    seamless digital security.
                  </p>
                  <div className="builder-links">
                    <a href="https://github.com/manassuryawanshi" target="_blank" rel="noopener noreferrer" className="social-icon">GitHub</a>
                    <a href="https://www.linkedin.com/in/manas-suryawanshi-623473242/" target="_blank" rel="noopener noreferrer" className="social-icon">LinkedIn</a>
                    <a href="https://www.linkedin.com/in/manas-suryawanshi-623473242/" target="_blank" rel="noopener noreferrer" className="social-icon">Portfolio</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo-container" style={{ marginBottom: '1.5rem' }}>
                <h1 className="nav-logo" style={{ fontSize: '1.8rem' }}>MAILGUARD<span className="live-gradient">.</span></h1>
              </div>
              <p className="footer-desc">
                Protecting your digital identity through AI-powered threat analysis and real-time cybersecurity education.
              </p>
              <div className="footer-status">
                <span className="pulse-dot"></span> System Status: <strong>Operational</strong>
              </div>
            </div>

            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#scannerSection">Scanner</a>
              <a href="#stats">Threat Data</a>
              <a href="#education">Anatomy</a>
              <a href="#learnSection">Tactics</a>
            </div>

            <div className="footer-links">
              <h4>Resources</h4>
              <a href="#tips">Cyber Safety</a>
              <a href="#teamSection">Meet the Builder</a>
              <a href="#">API Documentation</a>
              <a href="#">Privacy Policy</a>
            </div>

            <div className="footer-social">
              <h4>Connect</h4>
              <div className="social-icons">
                <a href="https://github.com/manassuryawanshi" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="https://www.linkedin.com/in/manas-suryawanshi-623473242/" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://www.linkedin.com/in/manas-suryawanshi-623473242/" target="_blank" rel="noopener noreferrer" className="social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} MailGuard AI Security Platform. All rights reserved.</p>
            <div className="footer-badges">
              <span>GDPR Compliant</span>
              <span>AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
