import React, { useState } from "react";
import { Copy, CheckCircle2, ShieldAlert } from "lucide-react";
import "./App.css";

/* =========================
   HELPERS
   ========================= */

// random separator: only "-" or "_"
const randomSeparator = () => (Math.random() > 0.5 ? "-" : "_");

// insert separator at fixed index
const breakWordRandomly = (word, index) => {
  const sep = randomSeparator();
  return word.slice(0, index) + sep + word.slice(index);
};

// preserve original casing
const preserveCase = (original, replacement) => {
  if (original === original.toUpperCase()) {
    return replacement.toUpperCase();
  }
  if (original === original.toLowerCase()) {
    return replacement.toLowerCase();
  }
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

/* =========================
   WORD RULES
   ========================= */

const replacements = [
  { regex: /\bpayment\b/gi, index: 2 },   // pa-yment / pa_yment
  { regex: /\bpay\b/gi, index: 2 },       // pa-y / pa_y
  { regex: /\bemail\b/gi, index: 3 },     // ema-il / ema_il
  { regex: /\bmail\b/gi, index: 2 },      // ma-il / ma_il
  { regex: /\bgmail\b/gi, index: 2 },     // gm-ail / gm_ail
  { regex: /\bwhatsapp\b/gi, index: 4 },  // what-sapp / what_sapp
  { regex: /\bskype\b/gi, index: 3 },     // sky-pe / sky_pe
  { regex: /\btelegram\b/gi, index: 2 },  // te-legram / te_legram
  { regex: /\bmoney\b/gi, index: 2 },     // mo-ney / mo_ney
  { regex: /\bdollar\b/gi, index: 2 },    // do-llar / do_llar
  { regex: /\breview\b/gi, index: 4 },    // revi-ew / revi_ew
];

/* =========================
   APP
   ========================= */

const App = () => {
  const [message, setMessage] = useState("");
  const [correctedMessage, setCorrectedMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const inputText = e.target.value;
    let updatedText = inputText;

    replacements.forEach(({ regex, index }) => {
      updatedText = updatedText.replace(regex, (match) => {
        const broken = breakWordRandomly(match, index);
        return preserveCase(match, broken);
      });
    });

    setMessage(inputText);
    setCorrectedMessage(updatedText);
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
