import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  // PASTE YOUR CONFIG HERE
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const wall = document.getElementById("wall");
const forum = document.getElementById("forum");
const authDiv = document.getElementById("auth");
const userText = document.getElementById("user");

window.signUp = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .catch(err => alert(err.message));
};

window.logIn = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(err => alert(err.message));
};

onAuthStateChanged(auth, user => {
  if (user) {
    authDiv.hidden = true;
    forum.hidden = false;
    userText.textContent = "Logged in as: " + user.email;
    loadPosts();
  }
});

window.addPost = async () => {
  if (!title.value || !content.value) return;

  await addDoc(collection(db, "posts"), {
    title: title.value,
    content: content.value,
    user: auth.currentUser.email,
    createdAt: new Date()
  });

  title.value = "";
  content.value = "";
};

function loadPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(q, snapshot => {
    wall.innerHTML = "";
    snapshot.forEach(doc => {
      const post = doc.data();
      const card = document.createElement("div");
      const rotation = (Math.random() * 4 - 2).toFixed(2);
card.style.transform = `rotate(${rotation}deg)`;

      card.className = "card";
      card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>${post.user}</small>
  
      wall.appendChild(card);
    });
  });
}
