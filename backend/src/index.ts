import express from "express";
import cors from "cors";
import { PORT } from "./secrets";

import rootRouter from "./routes/index.routes";

const app = express();


app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes
app.get("/" , (req,res)=>{
  res.send("Backend running properly")
})
app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

export default app;