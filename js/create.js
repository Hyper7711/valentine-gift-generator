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

    alert("Gift link generated 💖\n\n" + link);
  } catch (error) {
    console.error("Firestore error:", error);
    alert("Error saving gift.");
  }
});