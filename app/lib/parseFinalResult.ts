export type QuestionReview = {
  question: string;
  answerSummary: string;
  suggestion: string;
};

export type FinalReview = {
  score: number | null;
  maxScore: number;
  perQuestion: QuestionReview[];
  pros: string[];
  cons: string[];
  suggestions: string[];
  raw: string;
};

function extractSection(
  text: string,
  startLabel: string,
  endLabels: string[]
): string {
  const startIdx = text.indexOf(startLabel);
  if (startIdx === -1) return "";
  const afterStart = startIdx + startLabel.length;
  let endIdx = text.length;
  for (const label of endLabels) {
    const idx = text.indexOf(label, afterStart);
    if (idx !== -1 && idx < endIdx) endIdx = idx;
  }
  return text
    .slice(afterStart, endIdx)
    .replace(/^[:：\s]+/, "")
    .trim();
}

function toBullets(block: string): string[] {
  return block
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter((line) => line.length > 0 && !/^[-：:]+$/.test(line));
}

function stripLabel(value: string): string {
  return value.replace(/^[:：\s]+/, "").trim();
}

export function parseFinalResult(text: string): FinalReview {
  const scoreMatch = text.match(/整體評分[:：]\s*([\d.]+)\s*\/\s*(\d+)/);
  const score = scoreMatch ? Number(scoreMatch[1]) : null;
  const maxScore = scoreMatch ? Number(scoreMatch[2]) : 10;

  const perQuestionBlock = extractSection(text, "逐題建議", ["整體評分"]);
  const prosBlock = extractSection(text, "優點", ["待改進之處", "綜合建議"]);
  const consBlock = extractSection(text, "待改進之處", ["綜合建議"]);
  const suggestionsBlock = extractSection(text, "綜合建議", []);

  const perQuestion: QuestionReview[] = [];
  if (perQuestionBlock) {
    const parts = perQuestionBlock
      .split(/第\s*\d+\s*題[:：]/)
      .filter((part) => part.trim().length > 0);

    for (const part of parts) {
      const summaryIdx = part.indexOf("你的回答摘要");
      const suggestionIdx = part.indexOf("建議回答方式");
      if (summaryIdx === -1 || suggestionIdx === -1) continue;

      const question = part.slice(0, summaryIdx).replace(/[-–—]+$/, "").trim();
      const answerSummary = stripLabel(
        part.slice(summaryIdx + "你的回答摘要".length, suggestionIdx)
      );
      const suggestion = stripLabel(part.slice(suggestionIdx + "建議回答方式".length))
        .replace(/[-–—\s]+$/, "")
        .trim();

      if (question && answerSummary && suggestion) {
        perQuestion.push({ question, answerSummary, suggestion });
      }
    }
  }

  return {
    score,
    maxScore,
    perQuestion,
    pros: toBullets(prosBlock),
    cons: toBullets(consBlock),
    suggestions: toBullets(suggestionsBlock),
    raw: text,
  };
}
