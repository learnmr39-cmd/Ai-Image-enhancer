async function uploadImage() {

  const fileInput = document.getElementById("imageInput");
  const loading = document.getElementById("loading");
  const resultImg = document.getElementById("result");

  if (!fileInput.files[0]) {
    alert("Select image first");
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  loading.style.display = "block";
  resultImg.src = "";

  try {
    const response = await fetch("/enhance", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.output_url) {
      resultImg.src = data.output_url;
    } else {
      alert("Error enhancing image");
    }

  } catch (error) {
    alert("Server error");
  }

  loading.style.display = "none";
}
