import Head from "next/head";
import { useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";

// Config variables
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL;
const GOOGLE_SERVICE_PRIVATE_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_SERVICE_PRIVATE_KEY;

// GoogleSpreadsheet Initialize
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

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
  const [errorMessage, setErrorMessage] = useState("");

  // added a new state variable to store the updated output
  const [updatedApiOutput, setUpdatedApiOutput] = useState("");

  const goToNextStep = () => {
    const link = document.querySelector(".campaign a");
    const inputs = document.querySelectorAll(".prompt-box");

    // check if all required fields have been filled
    const isValid = Array.from(inputs).every((input) => input.checkValidity());

    if (!isValid) {
      setErrorMessage("Please fill in all required fields.");
    } else {
      setErrorMessage("");
    }

    if (isValid) {
      if (link !== null) {
        link.remove();
      }

      setCurrentAction(currentAction + 1);
    }
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

  const appendSpreadsheet = async (row) => {
    try {
      await doc.useServiceAccountAuth({
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
      // loads document properties and worksheets
      await doc.loadInfo();

      const sheet = doc.sheetsById[SHEET_ID];
      await sheet.addRow(row);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const submitForm = () => {
    // Data add for append
    const newRow = {
      Email: email,
      Location: location,
      Name: nonProfitName,
      Revenue: revenueRange,
      Purpose: purpose,
      Activities: activities,
    };

    appendSpreadsheet(newRow);
  };

  const generateFile = () => {
    callGenerateEndpoint();
    submitForm();
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
        <title>Campaign Writer</title>
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
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
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
            Company's Location (City, Country):
          </label>
          <input
            placeholder="enter your location 🌍"
            id="user-input-location"
            className="prompt-box"
            value={location}
            required
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
            Your non-profit name:
          </label>
          <input
            placeholder="enter your non-profit name 🌍"
            id="user-input-nonprofit"
            className="prompt-box"
            value={nonProfitName}
            required
            onChange={(e) => setNonProfitName(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {currentAction === 4 && (
        <div className="prompt-container">
          <label htmlFor="user-input-range" className="prompt-label">
            Your Annual Revenue:
          </label>
          <div className="prompt-slider-value">
            {revenueRange && (
              <div className="prompt-slider-dollar">${revenueRange}</div>
            )}
            <input
              type="range"
              min="0"
              max="10000000"
              step="5000"
              value={revenueRange}
              className="prompt-slider"
              id="user-input-range"
              onChange={(e) => setRevenueRange(e.target.value)}
            />
          </div>
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
            Your organization purpose:
          </label>
          <input
            placeholder="enter your purpose 🌍"
            id="user-input-purpose"
            className="prompt-box"
            value={purpose}
            required
            onChange={(e) => setPurpose(e.target.value)}
          />
          <div className="prompt-buttons">
            <a className="generate-button" onClick={goToNextStep}>
              Next
            </a>
          </div>
        </div>
      )}

      {!apiOutput && currentAction === 6 && (
        <div className="prompt-container">
          <label htmlFor="user-input" className="prompt-label">
            Current activities of the non-profit:
          </label>
          <input
            placeholder="enter your current activities here 🤔"
            id="user-input"
            className="prompt-box"
            value={activities}
            required
            onChange={(e) => setActivities(e.target.value)}
          />
          <div className="prompt-buttons">
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={generateFile}
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
          <div className="prompt-buttons campaign">
            <a className="generate-button campaign" onClick={goToNextStep}>
              Create a Campaign
            </a>
          </div>
        </div>
      )}

      {currentAction === 7 && (
        <div className="prompt-container">
          <label htmlFor="user-input-goal" className="prompt-label">
            Your Fundraising Goal (in $):
          </label>
          <input
            placeholder="your goal 🤔"
            id="user-input-goal"
            className="prompt-box"
            value={goal}
            required
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
            Campaign Duration (in weeks):
          </label>
          <input
            placeholder="your duration 🤔"
            id="user-input-duration"
            className="prompt-box"
            type="number"
            value={duration}
            required
            min="0"
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
          <label htmlFor="user-input-focus" className="prompt-label">
            Your Campaign's focus:
          </label>
          <input
            placeholder="your focus 🤔"
            id="user-input-focus"
            className="prompt-box"
            value={focus}
            required
            onChange={(e) => setFocus(e.target.value)}
          />
          <div className="prompt-buttons">
            <a
              className={
                isCampaignGenerating
                  ? "generate-button loading"
                  : "generate-button"
              }
              onClick={callUpdateEndpoint}
            >
              <div className="generate">
                {isCampaignGenerating ? (
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
