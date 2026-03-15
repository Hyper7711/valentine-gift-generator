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

const heartsContainer = document.getElementById("hearts");

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


// Slideshow
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


// Message system
function showNextMessage() {

  if (!giftData.messages || giftData.messages.length === 0) return;

  const text = giftData.messages[currentStep];

  animatedText.classList.remove("fade-in","fade-out");

  animatedText.innerText = text;

  setTimeout(()=>{
    animatedText.classList.add("fade-in");
  },50);

  setTimeout(()=>{
    showContinueButton();
  },2500);

}


// Continue button
function showContinueButton(){

  const btn = document.createElement("button");

  btn.innerText = "Continue 💖";
  btn.className = "btn";

  btn.onclick = () => {

    animatedText.classList.remove("fade-in");
    animatedText.classList.add("fade-out");

    setTimeout(()=>{

      btn.remove();

      currentStep++;

      if (currentStep < giftData.messages.length) {

        showNextMessage();

      } else {

        showProposalScreen();

      }

    },800);

  };

  giftContent.appendChild(btn);

}


// Proposal screen
function showProposalScreen(){

  animatedText.innerHTML = "";

  const proposal = document.createElement("div");

  proposal.classList.add("proposal-card");

  proposal.innerHTML = `
  <h2 class="proposal-title">Will you be my Valentine? 💍</h2>

  <div class="proposal-buttons">

  <button id="yesBtn" class="btn yes-btn">YES 💕</button>

  <button id="noBtn" class="btn no-btn">NO 😢</button>

  </div>
  `;

  giftContent.appendChild(proposal);

  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");


  // YES
  yesBtn.onclick = () => {

    confetti({
      particleCount:200,
      spread:120,
      origin:{y:0.6}
    });

    for(let i=0;i<20;i++){
      createHeart();
    }

    proposal.innerHTML = `
    <h2 class="proposal-title">❤️ She Said YES ❤️</h2>
    <p style="margin-top:10px;font-size:18px;">Love Wins 💖</p>
    `;

    reaction.innerHTML = "💖💖💖";

  };


  // NO button escape
  let moveCount = 0;

  const sadEmojis = ["🥺","💔","😭","😿","😢"];

  noBtn.addEventListener("mouseover",()=>{

    moveCount++;

    const x = Math.random()*300-150;
    const y = Math.random()*200-100;

    noBtn.style.position="relative";
    noBtn.style.transform=`translate(${x}px, ${y}px)`;

    const randomEmoji = sadEmojis[Math.floor(Math.random()*sadEmojis.length)];

    reaction.innerHTML = randomEmoji;

    if(moveCount===3){
      alert("Hey! Don't break my heart 🥺");
    }

    if(moveCount===6){
      alert("Come on... click YES 💖");
    }

  });

}


// Floating hearts
function createHeart(){

  if(!heartsContainer) return;

  const heart = document.createElement("div");

  heart.className="heart";

  const hearts=["💖","💗","💓","💕"];

  heart.innerHTML = hearts[Math.floor(Math.random()*hearts.length)];

  heart.style.left = Math.random()*100+"vw";
  heart.style.animationDuration = (4+Math.random()*4)+"s";
  heart.style.fontSize = (18+Math.random()*20)+"px";

  heartsContainer.appendChild(heart);

  setTimeout(()=>heart.remove(),8000);

}


// Start heart generator
setInterval(createHeart,600);
