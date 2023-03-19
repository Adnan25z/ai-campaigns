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
const basePromptMiddleThree = ". generate a sms campaign for me.";
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(
    `API: ${basePromptPrefix}${req.body.location}${basePromptMiddle}${req.body.name}${basePromptMiddleOne}${req.body.revenue}${basePromptMiddleTwo}${req.body.purpose}`
  );

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.location}${basePromptMiddle}${req.body.name}${basePromptMiddleOne}${req.body.revenue}${basePromptMiddleTwo}${req.body.purpose}`,
    temperature: 0.7,
    max_tokens: 300,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
