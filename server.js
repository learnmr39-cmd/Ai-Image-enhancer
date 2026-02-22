const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const app = express();

app.use(express.static("public"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

const API_KEY = process.env.DEEPAI_API_KEY;

app.post("/enhance", upload.single("image"), async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

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

    console.log("ERROR:", err.response?.data || err.message);

    res.status(500).json({ error: "Enhancement failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
