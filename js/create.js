
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function compressImage(file, maxWidth = 1000, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/webp", quality);

      resolve(compressed);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const form = document.getElementById("giftForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Convert textarea into array
  const rawMessages = document.getElementById("messages").value;
  const messagesArray = rawMessages
    .split("\n")
    .map(msg => msg.trim())
    .filter(msg => msg.length > 0);

  if (messagesArray.length === 0) {
  alert("Please write at least one love message 💌");
  return;
  }

const photoInput = document.getElementById("photoUrls");

const files = Array.from(photoInput.files).slice(0, 6);

const photosArray = await Promise.all(
  files.map(file => compressImage(file))
);

  const gift = {
  yourName: document.getElementById("yourName").value,
  partnerName: document.getElementById("partnerName").value,
  messages: messagesArray,
  photos: photosArray,
  password: document.getElementById("password").value,
  createdAt: Date.now()
};

  try {
    const docRef = await addDoc(collection(db, "gifts"), gift);

    const link = `${window.location.origin}/gift.html?id=${docRef.id}`;

    // Create share popup
    const shareBox = document.createElement("div");

    shareBox.innerHTML = `
      <div style="
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        background:white;
        padding:25px;
        border-radius:12px;
        box-shadow:0 0 20px rgba(0,0,0,0.2);
        text-align:center;
        z-index:9999;
        max-width:350px;
      ">

      <h3>Gift Link Generated 💖</h3>

      <input value="${link}" readonly style="width:100%;padding:8px;margin-top:10px;border:1px solid #ccc;border-radius:6px"/>

      <br><br>

      <button id="copyBtn" class="btn">Copy Link</button>

      <a href="https://wa.me/?text=${encodeURIComponent(link)}" target="_blank">
        <button class="btn" style="margin-left:10px;background:#25D366;">
          Share WhatsApp
        </button>
      </a>

      </div>
    `;

    document.body.appendChild(shareBox);

    // Copy button logic
    document.getElementById("copyBtn").onclick = () => {
      navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    };

  } catch (error) {
    console.error("Firestore error:", error);
    alert("Error saving gift.");
  }
});


const photoInput = document.getElementById("photoUrls");
const preview = document.getElementById("preview");

if (photoInput && preview) {

  photoInput.addEventListener("change", () => {

    preview.innerHTML = "";

    const files = Array.from(photoInput.files).slice(0, 6);

    files.forEach((file) => {

      // Make sure it is an image
      if (!file.type.startsWith("image/")) {
        return;
      }

      const img = document.createElement("img");

      // Temporary local preview
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };

      preview.appendChild(img);

    });

  });

}
