import React, { useState } from "react";
import { Copy, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import "./App.css";

const replacements = [
  { regex: /payment/gi, replace: "P-ayment" },
  { regex: /pay/gi, replace: "P-ay" },
  { regex: /email/gi, replace: "E-mail" },
  { regex: /whatsapp/gi, replace: "What-sApp" },
  { regex: /skype/gi, replace: "Sky-pe" },
  { regex: /telegram/gi, replace: "Te-legram" },
  { regex: /5-star review/gi, replace: "5-St(a)r Review" },
  { regex: /5 star review/gi, replace: "5-St(a)r Review" },
  { regex: /money/gi, replace: "Mo-ney" },
];

const App = () => {
  const [message, setMessage] = useState("");
  const [correctedMessage, setCorrectedMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const capitalizeFirstLetter = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const handleChange = (e) => {
    const inputText = e.target.value;
    let updatedText = inputText;

    replacements.forEach(({ regex, replace }) => {
      updatedText = updatedText.replace(regex, replace);
    });

    if (updatedText.length > 0) {
      updatedText = capitalizeFirstLetter(updatedText);
    }

    setMessage(inputText);
    setCorrectedMessage(updatedText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">

      <div className="card">
        <header className="header">
          <h1 className="title">CC Message Guard</h1>

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
                Safe
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
              placeholder="Copy your output "
              className="textarea outputArea"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
