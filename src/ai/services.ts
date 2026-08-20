export interface AIGenerateCaseInput {
  caseType: string;
  difficulty: string;
  suspectCount: number;
  location: string;
  crimeType: string;
  clueCount: number;
  redHerringCount: number;
}

export async function generateCase(input: AIGenerateCaseInput) {
  void input;
  throw new Error(
    "AI Case Generation requires an OpenAI API key. Set OPENAI_API_KEY in your .env file."
  );
}

export async function askDetectiveAssistant(query: string, caseContext: unknown) {
  void query;
  void caseContext;
  throw new Error(
    "AI Assistant requires an OpenAI API key. Set OPENAI_API_KEY in your .env file."
  );
}

export async function interviewSuspect(
  suspectId: string,
  question: string,
  caseContext: unknown
) {
  void suspectId;
  void question;
  void caseContext;
  throw new Error(
    "AI Interrogation requires an OpenAI API key. Set OPENAI_API_KEY in your .env file."
  );
}
