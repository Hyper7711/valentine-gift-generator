const form = document.getElementById("giftForm");
const imagesInput = document.getElementById("images");
const preview = document.getElementById("preview");

let selectedImages = [];
let selectedMusic = null;

// IMAGE PREVIEW
imagesInput.addEventListener("change", () => {
  preview.innerHTML = "";
  selectedImages = Array.from(imagesInput.files);

  if (selectedImages.length > 6) {
    alert("You can upload maximum 6 images.");
    imagesInput.value = "";
    return;
  }

  selectedImages.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement("img");
      img.src = reader.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// MUSIC SELECT
document.getElementById("music").addEventListener("change", (e) => {
  selectedMusic = e.target.files[0];
  alert("Music selected 🎶");
});

// FORM SUBMIT
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (selectedImages.length === 0) {
    alert("Please upload at least one image.");
    return;
  }

  const giftData = {
    yourName: document.getElementById("yourName").value,
    partnerName: document.getElementById("partnerName").value,
    message: document.getElementById("message").value,
    password: document.getElementById("password").value,
  };

  console.log("Gift Data:", giftData);
  console.log("Images:", selectedImages);
  console.log("Music:", selectedMusic);

  alert("Phase 3 complete! Next: Firebase integration 🚀");
});
