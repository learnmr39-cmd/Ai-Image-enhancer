import express from "express";
import multer from "multer";
import fs from "fs";
import Replicate from "replicate";

const app = express();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.use(express.static("public"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

app.post("/enhance", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file" });
    }

    const imageBuffer = fs.readFileSync(req.file.path);

    const output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: imageBuffer,
          scale: 2
        }
      }
    );

    fs.unlinkSync(req.file.path);

    res.json({ output_url: output });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Enhancement failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
