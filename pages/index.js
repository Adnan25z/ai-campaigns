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
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activities, setActivities] = useState("");
  // added a new state variable to store the updated output
  const [updatedApiOutput, setUpdatedApiOutput] = useState("");
  // added a new state variable to store the updated user input
  const [updatedUserInput, setUpdatedUserInput] = useState("");


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
    setIsGenerating(true);

    console.log("Calling OpenAI with updated inputs...");
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
        userInput: `${userInput}${updatedUserInput}`,
      }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied with updated output...", output.text);

    setUpdatedApiOutput(`${output.text}`);
    setIsGenerating(false);
  };

  // add a new event handler for the updated input
  const onUpdatedUserChangedText = (event) => {
    console.log(event.target.value);
    setUpdatedUserInput(event.target.value);
  };

  //const onUserChangedText = (event) => {
  //  console.log(event.target.value);
  //  setUserInput(event.target.value);
  //};

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

      {currentAction === 7 && (
        <div className="prompt-container">
          <label htmlFor="user-input-updated" className="prompt-label">
            Additional thoughts:
          </label>
          <textarea
            placeholder="Feel free to update here 🤔"
            id="user-input-updated"
            className="prompt-box"
            value={updatedUserInput}
            onChange={onUpdatedUserChangedText}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={callUpdateEndpoint}>
              Create a Campaign
            </a>
          </div>
        </div>
      )}

      {updatedApiOutput && (
        <div className="output-container">
          <h3>Updated Output:</h3>
          <p className="output-text">{updatedApiOutput}</p>
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
