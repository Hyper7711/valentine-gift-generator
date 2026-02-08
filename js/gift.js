import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const giftId = params.get("id");

const passwordScreen = document.getElementById("passwordScreen");
const giftContent = document.getElementById("giftContent");
const unlockBtn = document.getElementById("unlockBtn");
const errorMsg = document.getElementById("errorMsg");

const title = document.getElementById("title");
const animatedText = document.getElementById("animatedText");

let giftData = null;

// Disable button until data loads
unlockBtn.disabled = true;
unlockBtn.innerText = "Loading...";

if (!giftId) {
  alert("Invalid gift link");
}

// 🔥 FETCH DATA SAFELY
async function loadGift() {
  try {
    const giftRef = doc(db, "gifts", giftId);
    const snap = await getDoc(giftRef);

    if (snap.exists()) {
      giftData = snap.data();
      unlockBtn.disabled = false;
      unlockBtn.innerText = "Unlock Gift";
    } else {
      alert("Gift not found");
    }
  } catch (err) {
    console.error("Error loading gift:", err);
    alert("Failed to load gift");
  }
}

loadGift();

// 🔐 UNLOCK HANDLER
unlockBtn.addEventListener("click", () => {
  if (!giftData) {
    errorMsg.innerText = "Please wait, loading gift...";
    return;
  }

  const enteredPassword = document.getElementById("giftPassword").value;

  if (enteredPassword === giftData.password) {
    passwordScreen.style.display = "none";
    giftContent.style.display = "block";

    title.innerText = `For ${giftData.partnerName} 💖`;
    animateText(giftData.message);
  } else {
    errorMsg.innerText = "Wrong password 😢";
  }
});

// ✨ TEXT ANIMATION
function animateText(text) {
  animatedText.innerText = "";
  let i = 0;

  const interval = setInterval(() => {
    animatedText.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 50);
}
