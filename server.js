const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static("public"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

const API_KEY = "PASTE_YOUR_DEEPAI_API_KEY_HERE";

app.post("/enhance", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "https://api.deepai.org/api/torch-srgan",
      form,
      {
        headers: {
          "api-key": API_KEY,
          ...form.getHeaders()
        }
      }
    );

    fs.unlinkSync(req.file.path);

    res.json({ output_url: response.data.output_url });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Enhancement failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
