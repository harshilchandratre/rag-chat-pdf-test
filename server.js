import "dotenv/config";
import express from "express";
import queryRoutes from "./src/routes/queryRoutes.js";

const app = express();
app.use(express.json());
app.use("/query", queryRoutes);

app.listen(3000, () => {
  console.log("server runs", `http://localhost:3000`);
});
