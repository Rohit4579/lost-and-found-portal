import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendResolvedEmail } from "./sendEmail.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { toEmail, itemName } = req.body;
  try {
    const success = await sendResolvedEmail(toEmail, itemName);
    res.json({ success });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
