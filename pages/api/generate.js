import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "My location is ";
const basePromptMiddle = " and I work for ";
const basePromptMiddleOne = " which generates ";
const basePromptMiddleTwo =
  " in revenue.  The purpose of the non-profit organization is ";
const basePromptMiddleThree = ". Currently my organization does ";

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(
    `API Call 1: ${basePromptPrefix}${req.body.location}${basePromptMiddle}${req.body.name}${basePromptMiddleOne}${req.body.revenue}${basePromptMiddleTwo}${req.body.purpose}${basePromptMiddleThree}${req.body.activities}`
  );

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.location}${basePromptMiddle}${req.body.name}${basePromptMiddleOne}${req.body.revenue}${basePromptMiddleTwo}${req.body.purpose}${basePromptMiddleThree}${req.body.activities}`,
    temperature: 0.8,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });

  // I build Prompt #2.
  const secondPrompt = `Take the context of the organization ${basePromptOutput.index}
  We have a goal of raising ${req.body.goal} in the duration of ${req.body.duation}. 
  We only have ${req.body.channelType} as a communication channel. Focus of the campaign must be ${req.body.focus}.
  Can you create a template campaign to help us reach this goal? 
  Make the campaign more aspirational and provide examples of all 8 sms.
  `;
  console.log(
    `API Call 2: ${basePromptPrefix}${req.body.location}${basePromptMiddle}${req.body.name}${basePromptMiddleOne}${req.body.revenue}${basePromptMiddleTwo}${req.body.purpose}${basePromptMiddleThree}${req.body.activities}`
  );

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    temperature: 0.85,
    max_tokens: 1250,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
