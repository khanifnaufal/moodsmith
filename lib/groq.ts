import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  // We log a warning but don't throw immediately so build doesn't fail if the key is missing in development.
  console.warn("Warning: GROQ_API_KEY is not defined in environment variables.");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export default groq;
