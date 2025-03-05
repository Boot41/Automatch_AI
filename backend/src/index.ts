import express from "express";
import cors from "cors";
import { PORT } from "./secrets";

import rootRouter from "./routes/index.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin:any, callback:any) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error("Not allowed by CORS"));
      }
  },
  methods: 'GET,PUT,POST,DELETE,PATCH,HEAD',
  credentials: true
};

app.use(cors(corsOptions));
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