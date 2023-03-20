import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateSecond = async (req, res) => {
  // I build Prompt #2.
  const secondPrompt = `Take the context of the organization ${req.body.context}
  We have a goal of raising ${req.body.goal} in the duration of ${
    req.body.duration
  }. 
  We only have SMS as a communication channel. Focus of the campaign must be on ${
    req.body.focus
  }.
  Can you create a template campaign to help us reach this goal? 
  Make the campaign aspirational and provide examples of all ${
    req.body.duration * 2
  } sms.
  `;

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

export default generateSecond;
