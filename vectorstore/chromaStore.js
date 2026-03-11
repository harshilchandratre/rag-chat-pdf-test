import { CloudClient } from "chromadb";

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

const noopEmbedder = {
  generate: async (texts) => texts.map(() => []),
};

export const collection = await client.getOrCreateCollection({
  name: "documents",
  embeddingFunction: noopEmbedder,
});