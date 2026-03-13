import "dotenv/config";
import { indexDocument } from "./src/rag/pipeline.js";

// top level await to let indexing step finish before 
// user prompt is passed.
await indexDocument("./data/documents/summary.pdf");
console.log("Document indexed...");

/*
this is a one-time execution script that takes 
document path as a parameter and the 'indexDocument' 
function in the pipeline.js saves the chunks 
(derived from embedding model) to the vector database
which later is used to index top chunks passed to 
an LLM for the context 
*/
