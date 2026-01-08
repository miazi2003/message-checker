import React, { useState } from "react";
import { Copy, CheckCircle2, ShieldAlert } from "lucide-react";
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
];

/* Main transformer */
const makeSafeMessage = (text) => {
  let safeText = text;

  /* Handle "5 star" */
  safeText = safeText.replace(/5\s*star/gi, () => {
    return "5" + randomSeparator() + "star";
  });

  /* Match words with punctuation */
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

  const handleChange = (e) => {
    const input = e.target.value;
    setMessage(input);
    setCorrectedMessage(makeSafeMessage(input));
  };

  const copyToClipboard = () => {
    if (!correctedMessage) return;
    navigator.clipboard.writeText(correctedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <h1 className="title">Message Guard</h1>
          <p className="subtitle">
            Fiverr-safe message checker & auto-corrector
          </p>
        </header>

        <div className="grid">
          <div className="inputGroup">
            <label className="label">
              <ShieldAlert size={16} />
              Draft Message
            </label>
            <textarea
              value={message}
              onChange={handleChange}
              placeholder="Type your message here..."
              className="textarea"
            />
          </div>

          <div className="inputGroup">
            <div className="labelRow">
              <label className="label success">
                <CheckCircle2 size={16} />
                Safe Message
              </label>
              <button
                onClick={copyToClipboard}
                className="copyButton"
                disabled={!correctedMessage}
              >
                <Copy size={14} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <textarea
              value={correctedMessage}
              readOnly
              placeholder="Your Fiverr-safe message will appear here..."
              className="textarea outputArea"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
