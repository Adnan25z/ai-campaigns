import Head from "next/head";
import { useState } from "react";

const Home = () => {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [nonProfitName, setNonProfitName] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [purpose, setPurpose] = useState("");
  const [currentAction, setCurrentAction] = useState(1); // starts at step 1
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activities, setActivities] = useState("");

  const goToNextStep = () => {
    setCurrentAction(currentAction + 1);
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `${email}`,
        location: `${location}`,
        name: `${nonProfitName}`,
        revenue: `${revenueRange}`,
        purpose: `${purpose}`,
        activities: `${activities}`,
      }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>AI Campaign Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Empowering non-profits with AI-powered campaigns!</h2>
          </div>
        </div>
      </div>

      {currentAction === 1 && (
        <div className="prompt-container">
          <label htmlFor="user-input-email" className="prompt-label">
            Email Address:
          </label>
          <input
            placeholder="enter your email 🤓"
            id="user-input-email"
            className="prompt-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 2 && (
        <div className="prompt-container">
          <label htmlFor="user-input-location" className="prompt-label">
            Location:
          </label>
          <input
            placeholder="enter your location 🌍"
            id="user-input-location"
            className="prompt-box"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 3 && (
        <div className="prompt-container">
          <label htmlFor="user-input-nonprofit" className="prompt-label">
            Non-profit Name:
          </label>
          <input
            placeholder="enter your non-profit name 🌍"
            id="user-input-nonprofit"
            className="prompt-box"
            value={nonProfitName}
            onChange={(e) => setNonProfitName(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 4 && (
        <div className="prompt-container">
          <label htmlFor="user-input-range" className="prompt-label">
            Revenue Range:
          </label>
          <input
            placeholder="enter your revenue range 🌍"
            id="user-input-range"
            className="prompt-box"
            value={revenueRange}
            onChange={(e) => setRevenueRange(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 5 && (
        <div className="prompt-container">
          <label htmlFor="user-input-purpose" className="prompt-label">
            Purpose:
          </label>
          <input
            placeholder="enter your purpose 🌍"
            id="user-input-purpose"
            className="prompt-box"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 6 && (
        <div className="prompt-container">
          <label htmlFor="user-input" className="prompt-label">
            Current activities of the non-profit:
          </label>
          <textarea
            placeholder="enter your current activities here 🤔"
            id="user-input"
            className="prompt-box"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
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
        </div>
      )}

      {!isGenerating && apiOutput && (
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
  );
};

export default Home;
