import { loader } from "../loaders/pdfLoader.js";
import { embedText } from "../embeddings/embeddingModel.js";
import { collection } from "../../vectorstore/chromaStore.js";
import { model } from "../config/gemini.js";

/* 
function to load chunks to the 
embedding function 'embedText' that uses hf model
to converts each chunks[i] into an array of vectors
*/
export const indexDocument = async (path) => {

  // loader splits huge text to array of chunks
  const chunks = await loader(path);

  /* traversing through each chunck[i] and 
  passing each chunk[i] for embedding...
  */
  for (let i = 0; i < chunks.length; i++) {

    /* the embedText function uses hf model to convert
  chunk[i] into floating point numbers  */
    const embedding = await embedText(chunks[i]);
    console.log("embedded chunk...", embedding)

    // saving the vector array of the chunk[i] to chromadb
    await collection.add({
      ids: [`chunk-${i}`],
      embeddings: [embedding],
      documents: [chunks[i]],
    });
  }
};

/* function to get vectors of the prompt text
to later compare with the 
*/
export const askQuestions = async (question) => {
  const queryEmbedding = await embedText(question);

  /* this line queries chroma database with the
  embedded query/user prompt and fetches top 3 
  most similar results available in the collection.

  the result will be used as context
  */
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 3,
  });

  /* flattens the array 'result.documents'
  into single array and joins all elements 
  with single string separated by newline...*/
  const context = results.documents.flat().join("\n");
  console.log("context...", context)

  // the LLM prompt
  const prompt = `Below are the context and question prompt. Act like you did not have any context. But base your response based on it.  

  Context: ${context}
  Question: ${question}

  `;

  // passing the prompt to the LLM model
  const response = await model.generateContent(prompt);
  console.log("the LLM response...", response)
  return response.response.text();
};
