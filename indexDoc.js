import "dotenv/config";
import { indexDocument } from "./src/rag/pipeline.js";

await indexDocument("./data/documents/lex.pdf");
console.log("Document indexed...");
