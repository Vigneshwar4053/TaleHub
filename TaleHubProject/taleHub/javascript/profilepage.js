import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", async function () {
    const uid = localStorage.getItem('username');

    if (!uid) {
        alert('No user ID found in the local storage.');
        window.location.href = 'index.html';
        return;
    }

    const loadUserProfile = async (uid) => {
        try {
            const userRef = ref(database, 'users/' + uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                let userData = snapshot.val();
                let user_name = document.getElementById('username').textContent = uid;
                let bio = document.getElementById('bio1').textContent = userData.bio || 'No bio available';
                // document.getElementById('bio2').textContent = userData.bio2 || '';
                // document.getElementById('bio3').textContent = userData.bio3 || '';
                let userPhoto = document.getElementById('userPhoto').src = userData.profilePhoto
            } else {
                console.error("No such user document!");
            }
        } catch (error) {
            console.error("Error getting user document:", error);
        }
    };

    loadUserProfile(uid);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        alert('Signed out successfully');
        window.location.href = 'index.html';
    };

    const signInBtn = document.getElementById("signInBtn");
    signInBtn.textContent = 'Logout';
    signInBtn.classList.add('logout-btn');
    signInBtn.onclick = handleLogout;
});
