import React, { useState } from "react";
import { Copy, CheckCircle2, ShieldAlert } from "lucide-react";
import "./App.css";


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
    return replacement[0].toUpperCase() + replacement.slice(1).toLowerCase();
  }
  return replacement;
};

const replacements = [
  { regex: /\bpayment\b/gi, replace: "pa-yment" },
  { regex: /\bpay\b/gi, replace: "pa-y" },
  { regex: /\bemail\b/gi, replace: "e-mail" },
  { regex: /\bwhatsapp\b/gi, replace: "what-sapp" },
  { regex: /\bskype\b/gi, replace: "sky-pe" },
  { regex: /\btelegram\b/gi, replace: "te-legram" },
  { regex: /\b5[- ]star review\b/gi, replace: "5-st(a)r review" },
  { regex: /\bmoney\b/gi, replace: "mo-ney" },
  { regex: /\bmail\b/gi, replace: "ma-il" },
  { regex: /\bdollar\b/gi, replace: "do-llar" },
  { regex: /\breview\b/gi, replace: "revi-ew" },
];

const App = () => {
  const [message, setMessage] = useState("");
  const [correctedMessage, setCorrectedMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const inputText = e.target.value;
    let updatedText = inputText;

    replacements.forEach(({ regex, replace }) => {
      updatedText = updatedText.replace(regex, (match) =>
        preserveCase(match, replace)
      );
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
          <h1 className="title">CC Message Guard</h1>
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
