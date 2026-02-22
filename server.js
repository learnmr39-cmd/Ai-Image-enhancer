const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Replicate = require("replicate");

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

    if (!req.file) {
      return res.json({ error: "No file uploaded" });
    }

    const output = await replicate.run(
      "nightmareai/real-esrgan",
      {
        input: {
          image: req.file.path,
          scale: 2
        }
      }
    );

    fs.unlinkSync(req.file.path);

    res.json({ output_url: output });

  } catch (error) {

    console.log(error);

    res.json({ error: "Enhancement failed" });
  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
