import "dotenv/config";
import express from "express";
import queryRoutes from "./src/routes/queryRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import cors from "cors";

// express instance
const app = express();

// enabling cors
app.use(cors({ origin: "http://localhost:5173" })); //client

// enabling json requests
app.use(express.json());

// enabling queryRoutes
app.use("/query", queryRoutes);
app.use("/documents", documentRoutes);

// listening server on port 3000
app.listen(3000, () => {
  console.log("server runs", `http://localhost:3000`);
});
