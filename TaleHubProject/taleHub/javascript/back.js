// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfiUnMjqL1YBPutxvm0QqOCeRj6Eq6-7k",
    authDomain: "user-5d6f1.firebaseapp.com",
    databaseURL: "https://user-5d6f1-default-rtdb.firebaseio.com",
    projectId: "user-5d6f1",
    storageBucket: "user-5d6f1.appspot.com",
    messagingSenderId: "625811324846",
    appId: "1:625811324846:web:909c1abd8ccc0ea406d23f",
    measurementId: "G-327FV3DL3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    const createAccountForm = document.getElementById('createAccountForm');
    createAccountForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;

        try {
            const userRef = ref(database, 'users/' + username);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                alert('Username already exists!');
                return;
            }

            await set(userRef, {
                email: email,
                password: password,
                profilePhoto: '', // Default profile photo URL or empty
                bio: ''
            });

            alert('Account created successfully!');
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            createAccountForm.reset();
            document.getElementById('loginModal').style.display = 'none';
            window.location.href = 'profilepage.html';
        } catch (error) {
            alert(error.message);
        }
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `users`));
            if (snapshot.exists()) {
                let userFound = false;
                snapshot.forEach((userSnapshot) => {
                    const userData = userSnapshot.val();
                    if (userData.email === email && userData.password === password) {
                        userFound = true;
                        localStorage.setItem('username', userSnapshot.key);
                        localStorage.setItem('email', email);
                        alert('Logged in successfully!');
                        loginForm.reset();
                        window.location.href = 'profilepage.html';
                    }
                });

                if (!userFound) {
                    alert('Invalid email or password!');
                }
            } else {
                alert('No users found!');
            }
        } catch (error) {
            alert(error.message);
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        window.location.href = 'index.html';
    };

    // Listen for changes in the user's authentication status
    const username = localStorage.getItem('username');
    const signInBtn = document.getElementById("signInBtn");

    if (username) {
        signInBtn.textContent = 'Logout';
        signInBtn.classList.add('logout-btn');
        signInBtn.onclick = handleLogout;
    } else {
        signInBtn.textContent = 'Sign In';
        signInBtn.classList.remove('logout-btn');
        signInBtn.onclick = () => {
            modal.style.display = "block";
            loginPanel.style.display = "block";
            createAccountPanel.style.display = "none";
        };
    }


    // Modal functionality
    const modal = document.getElementById("loginModal");
    const span = document.getElementsByClassName("close")[0];
    const loginPanel = document.getElementById("loginPanel");
    const createAccountPanel = document.getElementById("createAccountPanel");
    const createAccountLink = document.getElementById("createAccountLink");
    const backToLoginLink = document.getElementById("backToLoginLink");

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
});

