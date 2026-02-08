const form = document.getElementById("giftForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const giftData = {
    yourName: document.getElementById("yourName").value,
    partnerName: document.getElementById("partnerName").value,
    message: document.getElementById("message").value,
    password: document.getElementById("password").value,
  };

  console.log("Gift Data:", giftData);
  alert("Gift data captured! Backend integration next 💖");
});
