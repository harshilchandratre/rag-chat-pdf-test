import { loader } from "../loaders/pdfLoader.js";
import { embedText } from "../embeddings/embeddingModel.js";
import { collection } from "../../vectorstore/chromaStore.js";
import { model } from "../config/gemini.js";

export const indexDocument = async (path) => {
  const chunks = await loader(path);
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i]);
    await collection.add({
      ids: [`chunk-${i}`],
      embeddings: [embedding],
      documents: [chunks[i]],
    });
  }
};

export const askQuestions = async (question) => {
  const queryEmbedding = await embedText(question);
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 3,
  });

  const context = results.documents.flat().join("\n");

  const prompt = `Answer the question using the context below.

  Context: ${context}
  Question: ${question}

  `;

  const response = await model.generateContent(prompt);

  return response.response.text();
};
