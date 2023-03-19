import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
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
  const [isCampaignGenerating, setCampaignIsGenerating] = useState(false);
  const [activities, setActivities] = useState("");

  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [channelType, setChannelType] = useState("");
  const [focus, setFocus] = useState("");

  // added a new state variable to store the updated output
  const [updatedApiOutput, setUpdatedApiOutput] = useState("");

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

  // add a new function to call the OpenAI API with updated inputs
  const callUpdateEndpoint = async () => {
    setCampaignIsGenerating(true);

    console.log("Calling OpenAI with updated inputs...");
    const response = await fetch("/api/generateSecond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context: `${apiOutput}`,
        goal: `${goal}`,
        duration: `${duration}`,
        channelType: `${channelType}`,
        focus: `${focus}`,
      }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied with updated output...", output.text);

    setUpdatedApiOutput(`${output.text}`);
    setCampaignIsGenerating(false);
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
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Create a Campaign
            </a>
          </div>
        </div>
      )}

      {currentAction === 7 && (
        <div className="prompt-container">
          <label htmlFor="user-input-goal" className="prompt-label">
            Goal:
          </label>
          <textarea
            placeholder="your goal 🤔"
            id="user-input-goal"
            className="prompt-box"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 8 && (
        <div className="prompt-container">
          <label htmlFor="user-input-duration" className="prompt-label">
            Duration:
          </label>
          <textarea
            placeholder="your duration 🤔"
            id="user-input-duration"
            className="prompt-box"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 9 && (
        <div className="prompt-container">
          <label htmlFor="user-input-channel" className="prompt-label">
            Channel Type:
          </label>
          <textarea
            placeholder="your channel 🤔"
            id="user-input-channel"
            className="prompt-box"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {currentAction === 10 && (
        <div className="prompt-container">
          <label htmlFor="user-input-focus" className="prompt-label">
            Focus:
          </label>
          <textarea
            placeholder="your focus 🤔"
            id="user-input-focus"
            className="prompt-box"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callUpdateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Submit</p>
                )}
              </div>
            </a>
          </div>
        </div>
      )}

      {!isGenerating && updatedApiOutput && (
        <div className="output">
          <div className="output-header-container">
            <div className="output-header">
              <h3>Campaigns Generated</h3>
            </div>
          </div>
          <div className="output-content">
            <p>{updatedApiOutput}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
