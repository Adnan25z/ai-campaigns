import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("User Email:", userEmail);
    // You can store the email in your preferred data store or state management tool
  };

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  const onEmailChangedText = (event) => {
    console.log(event.target.value);
    setUserEmail(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>AI Campaign Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Empowering Non-Profits with AI-Powered Campaigns!</h1>
          </div>
          <div className="header-subtitle">
            <h2>Generate Impactful Campaigns in Minutes with Our Web App</h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="email-input"
            value={userEmail}
            onChange={onEmailChangedText}
          />
          <button type="submit" className="email-submit">
            Next
          </button>
        </form>

        <textarea
          placeholder="wanna be a tech ninja? let's do this! 🤓"
          className="prompt-box"
          value={userInput}
          onChange={onUserChangedText}
        />
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? "generate-button loading" : "generate-button"
            }
            onClick={callGenerateEndpoint}
          >
            <div className="generate">
              {isGenerating ? (
                <span className="loader"></span>
              ) : (
                <p>Generate</p>
              )}
            </div>
          </a>
        </div>
        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{apiOutput}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
