import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

console.log("create.js loaded ✅");

const form = document.getElementById("giftForm");
console.log("Form element:", form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const gift = {
    yourName: document.getElementById("yourName").value,
    partnerName: document.getElementById("partnerName").value,
    message: document.getElementById("message").value,
    password: document.getElementById("password").value,
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
