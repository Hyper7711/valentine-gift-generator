// imports 
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

console.log("create.js loaded ✅");

const form = document.getElementById("giftForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Read photo URLs (one per line)
  const photoInput = document.getElementById("photoUrls")?.value || "";

  const photoUrls = photoInput
    .split("\n")
    .map(url => url.trim())
    .filter(url => url !== "")
    .slice(0, 6); // Max 6 images

  const gift = {
    yourName: document.getElementById("yourName").value,
    partnerName: document.getElementById("partnerName").value,
    message: document.getElementById("message").value,
    password: document.getElementById("password").value,
    photoUrls: photoUrls,
    createdAt: Date.now()
  };

  try {
    const docRef = await addDoc(collection(db, "gifts"), gift);

    const link = `${window.location.origin}/gift.html?id=${docRef.id}`;

    alert("Gift link generated 💖\n\n" + link);
  } catch (error) {
    console.error("Firestore error:", error);
    alert("Error saving gift. Check console.");
  }
});
