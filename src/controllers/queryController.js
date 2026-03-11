import { askQuestions } from "../rag/pipeline.js";

export const queryController = async (req, res) => {
  try {
    const { question } = req.body;
    const answer = await askQuestions(question);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
