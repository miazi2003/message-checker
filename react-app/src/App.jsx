import React, { useState } from "react";
import { Copy, CheckCircle2, ShieldAlert, Sparkles, Zap, Lock, AlertTriangle } from "lucide-react";
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

/* Risky keywords + break positions */
const riskyRules = [
  { word: "pay", breakAfter: 2 },      // pa-y
  { word: "mail", breakAfter: 2 },     // ma-il
  { word: "whatsapp", breakAfter: 4 }, // what-sapp
  { word: "review", breakAfter: 2 },   // re-view
  { word: "skype", breakAfter: 2 },    // sk-ype
  { word: "telegram", breakAfter: 3 }, // tel-egram
  { word: "money", breakAfter: 2 },    // mo-ney
  { word: "dollar", breakAfter: 3 },   // dol-lar
  { word: "email", breakAfter: 2 },    // em-ail (added since you mentioned email in example)
  { word: "payment", breakAfter: 3 },  // pay-ment (added since you mentioned payment in example)
  { word: "number", breakAfter: 3 },  // pay-ment (added since you mentioned payment in example)
  { word: "phone", breakAfter: 2 },  // pay-ment (added since you mentioned payment in example)
  { word: "bank", breakAfter: 2 },  // pay-ment (added since you mentioned payment in example)
];

/* Find risky words in text - improved version */
const findRiskyWords = (text) => {
  const foundWords = [];
  
  if (!text.trim()) return foundWords;
  
  // Split text into words (including punctuation)
  const words = text.split(/\s+/);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
    
    riskyRules.forEach(rule => {
      // Check if the risky word is contained within this word
      if (cleanWord.includes(rule.word)) {
        // Find all occurrences in the original word (with original casing)
        const regex = new RegExp(rule.word, 'gi');
        let match;
        
        while ((match = regex.exec(word)) !== null) {
          foundWords.push({
            original: match[0],
            lowercase: match[0].toLowerCase(),
            rule: rule
          });
        }
      }
    });
  });
  
  // Remove duplicates while preserving order
  const uniqueWords = [];
  const seen = new Set();
  
  foundWords.forEach(wordObj => {
    const key = `${wordObj.original.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueWords.push(wordObj);
    }
  });
  
  return uniqueWords;
};

/* Main transformer - improved to handle partial matches */
const makeSafeMessage = (text) => {
  let safeText = text;

  /* Special case: only "5 star" */
  safeText = safeText.replace(/5\s*star/gi, (match) => {
    // keep original casing for "star"
    const starPart = match.match(/star/i)[0];
    const brokenStar = starPart.replace(/ar/i, "(a)r");

    return "5 " + brokenStar;
  });

  /* Match words with risky content */
  safeText = safeText.replace(/\b[\w]+[^\s]*\b/g, (word) => {
    const lower = word.toLowerCase();

    for (const rule of riskyRules) {
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

    const words = input.trim().split(/\s+/).filter(w => w.length > 0);
    const safeWords = safe.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
    setSafeWordCount(safeWords.length);
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
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
          }}></div>
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
          {/* <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">Original</span>
              <span className="stat-value">{wordCount}</span>
              <span className="stat-unit">words</span>
            </div>
            <div className="stat-divider">→</div>
            <div className="stat safe-stat">
              <span className="stat-label">Safe</span>
              <span className="stat-value">{safeWordCount}</span>
              <span className="stat-unit">words</span>
            </div>
            <div className={`stat risk-stat ${riskyWords.length > 0 ? 'has-risk' : ''}`}>
              <span className="stat-label">Risky</span>
              <span className="stat-value">{riskyWords.length}</span>
              <span className="stat-unit">words</span>
            </div>
          </div> */}
        </header>

        {riskyWords.length > 0 && (
          <div className="risky-words-section">
            <div className="risky-words-header">
              <AlertTriangle size={18} className="alert-icon" />
              <h3>Risky Words Detected</h3>
              <span className="risky-count">{riskyWords.length} word{riskyWords.length > 1 ? 's' : ''}</span>
            </div>
            <div className="risky-words-grid">
              {riskyWords.map((wordObj, index) => {
                const separator = randomSeparator();
                const transformed = 
                  wordObj.original.slice(0, wordObj.rule.breakAfter) + 
                  separator + 
                  wordObj.original.slice(wordObj.rule.breakAfter);
                
                return (
                  <div key={index} className="risky-word-card">
                    <div className="risky-word-original">
                      <span className="word-value risky">{wordObj.original}</span>
                    </div>
                  </div>
                );
              })}
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
                  <p className="section-subtitle">Type your original message here</p>
                </div>
              </div>
              <div className={`risk-indicator ${wordCount > 0 ? 'active' : ''} ${riskyWords.length > 0 ? 'has-risky' : ''}`}>
                <span className="risk-dot"></span>
                <span className="risk-text">
                  {riskyWords.length > 0 
                    ? `${riskyWords.length} risky word${riskyWords.length > 1 ? 's' : ''} found`
                    : wordCount > 0 
                      ? 'All clear!' 
                      : 'Ready'
                  }
                </span>
              </div>
            </div>
            <textarea
              value={message}
              onChange={handleChange}
              placeholder="Type your message here... I'll make it Fiverr-safe automatically ✨
              
Example risky words: money, payment, email, pay, review, whatsapp"
              className="textarea input-area"
              autoFocus
            />
            <div className="textarea-footer">
              <span className="char-count">
                {message.length} characters • {wordCount} words
              </span>
              <button 
                className="clear-btn"
                onClick={() => {
                  setMessage("");
                  setCorrectedMessage("");
                  setWordCount(0);
                  setSafeWordCount(0);
                  setRiskyWords([]);
                }}
              >
                Clear
              </button>
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
                className={`copyButton ${copied ? 'copied' : ''}`}
                disabled={!correctedMessage}
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <textarea
              value={correctedMessage}
              readOnly
              placeholder="Your Fiverr-safe message will appear here automatically..."
              className="textarea output-area"
            />
            <div className="textarea-footer safe-footer">
              <span className="safe-badge">
                <Lock size={12} />
                Secured by Message Guard
              </span>
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