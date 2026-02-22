import express from "express";
import multer from "multer";
import fs from "fs";
import Replicate from "replicate";

const app = express();

app.use(express.static("public"));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

app.post("/enhance", upload.single("image"), async (req, res) => {

  try {

    if (!process.env.REPLICATE_API_TOKEN) {
      return res.json({ error: "Missing API token" });
    }

    if (!req.file) {
      return res.json({ error: "No file uploaded" });
    }

    const imageBase64 = fs.readFileSync(req.file.path, {
      encoding: "base64"
    });

    const output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: `data:image/png;base64,${imageBase64}`,
          scale: 2
        }
      }
    );

    fs.unlinkSync(req.file.path);

    res.json({ output_url: output });

  } catch (error) {

    console.log("REAL ERROR:", error);

    res.json({ error: "Enhancement failed" });
  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
