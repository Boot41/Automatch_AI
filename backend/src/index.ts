import express from "express";
import cors from "cors";
import path from "path";
import { PORT } from "./secrets";

import rootRouter from "./routes/index.routes";

const app = express();


app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// API routes
app.use("/api/v1", rootRouter);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../public")));

// Handle API routes first
app.get("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// For any other route, serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

export default app;