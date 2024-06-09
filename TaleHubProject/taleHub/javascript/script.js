// Description text typing animation
const descriptionText = "Tale Hub is a groundbreaking online platform designed to revolutionize the way writers share their stories and connect with readers. Unlike traditional publishing platforms, Tale Hub offers writers the opportunity to showcase their work in a dynamic and interactive environment, while also providing readers with access to a diverse range of captivating content.";
const descriptionElement = document.getElementById("description");

let words = descriptionText.split(" ");
let index = 0;

function displayWord() {
    if (index < words.length) {
        descriptionElement.innerHTML += words[index] + " ";
        index++;
        setTimeout(displayWord, 100); 
    }
}

displayWord();

// Modal functionality
const signInBtn = document.getElementById("signInBtn");
const modal = document.getElementById("loginModal");
const span = document.getElementsByClassName("close")[0];
const loginPanel = document.getElementById("loginPanel");
const createAccountPanel = document.getElementById("createAccountPanel");
const createAccountLink = document.getElementById("createAccountLink");
const backToLoginLink = document.getElementById("backToLoginLink");

signInBtn.onclick = function() {
    modal.style.display = "block";
    loginPanel.style.display = "block";
    createAccountPanel.style.display = "none";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

createAccountLink.onclick = function(event) {
    event.preventDefault();
    loginPanel.style.display = "none";
    createAccountPanel.style.display = "block";
}

backToLoginLink.onclick = function(event) {
    event.preventDefault();
    loginPanel.style.display = "block";
    createAccountPanel.style.display = "none";
}

// Sidebar functionality
const menuIcon = document.getElementById("menuIcon");
const sidebar = document.getElementById("sidebar");

menuIcon.onclick = function() {
    sidebar.style.width = "25%";
}

// Close sidebar when clicking outside of it
document.addEventListener("click", function(event) {
    if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
        sidebar.style.width = "0";
    }
});

// Profile picture upload functionality
const uploadIcon = document.getElementById("uploadIcon");
const uploadPhoto = document.getElementById("uploadPhoto");
const userPhoto = document.getElementById("userPhoto");

uploadIcon.onclick = function() {
    uploadPhoto.click();
}

uploadPhoto.onchange = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userPhoto.src = e.target.result;
            localStorage.setItem('profilePhoto', e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

// Load sidebar profile details from localStorage
const profilePhoto = localStorage.getItem('profilePhoto');
const username = localStorage.getItem('username');
const bio1 = localStorage.getItem('bio1');


if (profilePhoto) {
    document.getElementById('userPhoto').src = profilePhoto;
}
if (username) {
    document.getElementById('username').textContent = username;
}
if (bio1) {
    document.getElementById('bio1').textContent = bio1;
}


// Proceed button functionality
const proceedBtn = document.getElementById("proceedBtn");

proceedBtn.addEventListener("click", function() {
    window.location.href = "readerspage.html";
});

var coll = document.getElementsByClassName("collapsible");
var k;

for ( k= 0; k < coll.length; k++) {
coll[k].addEventListener("click", function() {
this.classList.toggle("active");
var content = this.nextElementSibling;
if (content.style.display === "block") {
  content.style.display = "none";
} else {
  content.style.display = "block";
    }
  });
}