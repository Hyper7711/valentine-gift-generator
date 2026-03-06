import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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

  const rawPhotos = document.getElementById("photoUrls")?.value || "";
  const photoUrlsArray = rawPhotos
    .split("\n")
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .slice(0, 6);

  const gift = {
    yourName: document.getElementById("yourName").value,
    partnerName: document.getElementById("partnerName").value,
    messages: messagesArray,
    photoUrls: photoUrlsArray,
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