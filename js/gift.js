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
const slideshowContainer = document.getElementById("photoSlideshow");
const reaction = document.getElementById("reaction");

let giftData = null;
let currentStep = 0;

unlockBtn.disabled = true;
unlockBtn.innerText = "Loading...";

if (!giftId) {
  alert("Invalid gift link");
}

// Load gift from Firestore
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
    console.error(err);
    alert("Failed to load gift");
  }
}

loadGift();

// Unlock Logic
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

    if (giftData.photoUrls?.length > 0) {
      displaySlideshow(giftData.photoUrls);
    }

    showNextMessage();

  } else {
    errorMsg.innerText = "Wrong password 😢";
  }
});


// Smooth Slideshow
function displaySlideshow(photoUrls) {

  slideshowContainer.innerHTML = "";

  photoUrls.forEach((url, index) => {

    const img = document.createElement("img");
    img.src = url;

    if (index === 0) img.classList.add("active");

    slideshowContainer.appendChild(img);
  });

  const images = slideshowContainer.querySelectorAll("img");

  if (images.length <= 1) return;

  let current = 0;

  setInterval(() => {

    images[current].classList.remove("active");

    current = (current + 1) % images.length;

    images[current].classList.add("active");

  }, 3000);
}


// Typing Animation
function showNextMessage(){

if(!giftData.messages?.length) return;

const text = giftData.messages[currentStep];

animatedText.classList.remove("fade-in","fade-out");
animatedText.innerText = text;

/* fade in */
setTimeout(()=>{
animatedText.classList.add("fade-in");
},50);

/* show continue button after pause */

setTimeout(()=>{
showContinueButton();
},2500);

}


function showContinueButton(){

const btn=document.createElement("button");

btn.innerText="Continue 💖";
btn.className="btn";

btn.onclick=()=>{

animatedText.classList.remove("fade-in");
animatedText.classList.add("fade-out");

setTimeout(()=>{

btn.remove();
currentStep++;

if(currentStep < giftData.messages.length){

showNextMessage();

}else{

showProposalScreen();

}

},800);

};

giftContent.appendChild(btn);

}


// Proposal Screen
function showProposalScreen() {

  animatedText.innerHTML = "";

  const proposal = document.createElement("div");

  proposal.classList.add("proposal-card");

  proposal.innerHTML = `
    <h2>Will you be my Valentine? 💍</h2>
    <div style="margin-top:20px;">
      <button id="yesBtn" class="btn">YES 💕</button>
      <button id="noBtn" class="btn" style="margin-left:10px;background:#999;">NO 😢</button>
    </div>
  `;

  giftContent.appendChild(proposal);

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");


  // YES CLICK
  yesBtn.onclick = () => {

    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 }
    });

    for (let i = 0; i < 20; i++) {
      createHeart();
    }

    proposal.innerHTML = `
      <h2>YAYYY!!! 💖🎉</h2>
      <p>You made my heart the happiest!</p>
      <p style="margin-top:10px;">Best day ever 🥰</p>
    `;

    reaction.innerHTML = "💖💖💖";
  };


  // NO BUTTON ESCAPE
  let moveCount = 0;

  const sadEmojis = ["🥺", "💔", "😭", "😿", "😢"];

  noBtn.addEventListener("mouseover", () => {

    moveCount++;

    const x = Math.random() * 300 - 150;
    const y = Math.random() * 200 - 100;

    noBtn.style.position = "relative";

    noBtn.style.transform = `translate(${x}px, ${y}px)`;

    const randomEmoji = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];

    reaction.innerHTML = randomEmoji;

    if (moveCount === 3) alert("Hey! Don't break my heart 🥺");

    if (moveCount === 6) alert("Come on... click YES 💖");
  });

}


// Floating hearts
const heartsContainer = document.getElementById("hearts");

function createHeart() {

  if (!heartsContainer) return;

  const heart = document.createElement("div");

  heart.className = "heart";

  heart.innerHTML = "💖";

  heart.style.left = Math.random() * 100 + "vw";

  heart.style.animationDuration = (4 + Math.random() * 3) + "s";

  heartsContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 6000);
}

setInterval(createHeart, 800);

