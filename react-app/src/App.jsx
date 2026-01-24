import React, { useState } from "react";
import {
  Copy,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Zap,
  Lock,
  AlertTriangle
} from "lucide-react";
import "./App.css";

/* Random separator */
const randomSeparator = () => (Math.random() > 0.5 ? "-" : "_");

/* Preserve original casing */
const preserveCase = (original, replacement) => {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original === original.toLowerCase()) return replacement.toLowerCase();
  if (
    original[0] === original[0].toUpperCase() &&
    original.slice(1) === original.slice(1).toLowerCase()
  ) {
    return (
      replacement[0].toUpperCase() +
      replacement.slice(1).toLowerCase()
    );
  }
  return replacement;
};

/* Risky keywords */
const riskyRules = [
  { word: "pay", breakAfter: 2 },
  { word: "mail", breakAfter: 2 },
  { word: "whatsapp", breakAfter: 4 },
  { word: "review", breakAfter: 2 }, // exact only
  { word: "skype", breakAfter: 2 },
  { word: "telegram", breakAfter: 3 },
  { word: "money", breakAfter: 2 },
  { word: "dollar", breakAfter: 3 },
  { word: "email", breakAfter: 2 },
  { word: "payment", breakAfter: 3 },
  { word: "number", breakAfter: 3 },
  { word: "phone", breakAfter: 2 },
  { word: "bank", breakAfter: 2 }
];

/* Find risky words (preview ignored, review exact) */
const findRiskyWords = (text) => {
  const foundWords = [];
  if (!text.trim()) return foundWords;

  const words = text.split(/\s+/);

  words.forEach((word) => {
    const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();

    riskyRules.forEach((rule) => {
      const isMatch =
        rule.word === "review"
          ? cleanWord === "review"
          : cleanWord.includes(rule.word);

      if (isMatch) {
        foundWords.push({ rule });
      }
    });
  });

  // remove duplicates
  const seen = new Set();
  return foundWords.filter((item) => {
    if (seen.has(item.rule.word)) return false;
    seen.add(item.rule.word);
    return true;
  });
};

/* Make Fiverr-safe message */
const makeSafeMessage = (text) => {
  let safeText = text;

  /* Special case: 5 star */
  safeText = safeText.replace(/5\s*star/gi, (match) => {
    const starPart = match.match(/star/i)[0];
    const brokenStar = starPart.replace(/ar/i, "(a)r");
    return "5 " + brokenStar;
  });

  safeText = safeText.replace(/\b[\w]+[^\s]*\b/g, (word) => {
    const lower = word.toLowerCase();

    for (const rule of riskyRules) {
      if (rule.word === "review" && lower !== "review") continue;

      const idx = lower.indexOf(rule.word);
      if (idx !== -1) {
        const breakPoint = idx + rule.breakAfter;
        const broken =
          word.slice(0, breakPoint) +
          randomSeparator() +
          word.slice(breakPoint);

        return preserveCase(word, broken);
      }
    }
    return word;
  });

  return safeText;
};

const App = () => {
  const [message, setMessage] = useState("");
  const [correctedMessage, setCorrectedMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [safeWordCount, setSafeWordCount] = useState(0);
  const [riskyWords, setRiskyWords] = useState([]);

  const handleChange = (e) => {
    const input = e.target.value;
    setMessage(input);

    const foundRiskyWords = findRiskyWords(input);
    setRiskyWords(foundRiskyWords);

    const safe = makeSafeMessage(input);
    setCorrectedMessage(safe);

    setWordCount(input.trim().split(/\s+/).filter(Boolean).length);
    setSafeWordCount(safe.trim().split(/\s+/).filter(Boolean).length);
  };

  const copyToClipboard = () => {
    if (!correctedMessage) return;
    navigator.clipboard.writeText(correctedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <div className="gradient-bg">
        <div className="gradient-circle gradient-1"></div>
        <div className="gradient-circle gradient-2"></div>
        <div className="gradient-circle gradient-3"></div>
        <div className="noise-overlay"></div>
      </div>

      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`
            }}
          />
        ))}
      </div>

      <div className="card">
        <header className="header">
          <div className="logo-container">
            <div className="logo-icon">
              <Lock size={28} />
            </div>
            <div>
              <h1 className="title">
                <span className="gradient-text">Message Guard</span>
              </h1>
              <p className="subtitle">
                <Zap size={14} />
                Fiverr-safe message checker & auto-corrector
              </p>
            </div>
          </div>
        </header>

        {riskyWords.length > 0 && (
          <div className="risky-words-section">
            <div className="risky-words-header">
              <AlertTriangle size={18} className="alert-icon" />
              <h3>Risky Words Detected</h3>
              <span className="risky-count">
                {riskyWords.length} word
                {riskyWords.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="risky-words-grid">
              {riskyWords.map((wordObj, index) => (
                <div key={index} className="risky-word-card">
                  <div className="risky-word-original">
                    <span className="word-value risky">
                      {wordObj.rule.word}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid">
          <div className="inputGroup">
            <div className="section-header">
              <div className="section-title">
                <ShieldAlert size={18} className="section-icon" />
                <div>
                  <h3>Draft Message</h3>
                  <p className="section-subtitle">
                    Type your original message here
                  </p>
                </div>
              </div>
            </div>

            <textarea
              value={message}
              onChange={handleChange}
              className="textarea input-area"
              placeholder="Type your message here..."
            />

            <div className="textarea-footer">
              <span className="char-count">
                {message.length} characters • {wordCount} words
              </span>
            </div>
          </div>

          <div className="inputGroup">
            <div className="section-header">
              <div className="section-title">
                <CheckCircle2 size={18} className="section-icon safe" />
                <div>
                  <h3>Safe Message</h3>
                  <p className="section-subtitle">Protected & Fiverr-ready</p>
                </div>
              </div>

              <button
                onClick={copyToClipboard}
                className={`copyButton ${copied ? "copied" : ""}`}
                disabled={!correctedMessage}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <textarea
              value={correctedMessage}
              readOnly
              className="textarea output-area"
            />

            <div className="textarea-footer safe-footer">
              <span className="char-count safe">
                {correctedMessage.length} characters • {safeWordCount} words
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
