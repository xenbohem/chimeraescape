// =========================
//  SUPABASE SETUP
// =========================

// Replace these with your Supabase project values
const supabaseUrl = "https://xetcjpoxdyrzfcionohq.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// =========================
//  DOM ELEMENTS
// =========================
const wall = document.getElementById("wall");
const forum = document.getElementById("forum");
const authDiv = document.getElementById("auth");
const userText = document.getElementById("user");

// Sticker options
const stickers = ["DIY", "ZINE", "VOID", "CUT & PASTE", "XEROX", "NO RULES", "HANDMADE"];
function randomSticker() {
  return stickers[Math.floor(Math.random() * stickers.length)];
}

// =========================
//  AUTH FUNCTIONS
// =========================
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);
  alert("Check your email to confirm your account!");
}

async function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);
}

// =========================
//  AUTH STATE HANDLER
// =========================
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session && session.user) {
    authDiv.hidden = true;
    forum.hidden = false;
    userText.textContent = "Logged in as: " + session.user.email;
    loadPosts();
    subscribePosts();
  } else {
    authDiv.hidden = false;
    forum.hidden = true;
    userText.textContent = "";
  }
});

// =========================
//  ADD POST
// =========================
async function addPost() {
  const titleEl = document.getElementById("title");
  const contentEl = document.getElementById("content");
  const user = await supabase.auth.getUser();
  const email = user.data.user.email;

  if (!titleEl.value || !contentEl.value) return;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title: titleEl.value, content: contentEl.value, user_email: email }]);

  if (error) return alert(error.message);

  titleEl.value = "";
  contentEl.value = "";
}

// =========================
//  LOAD POSTS (initial)
async function loadPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("inserted_at", { ascending: false });

  if (error) return console.error(error);

  wall.innerHTML = "";
  data.forEach(post => {
    createPostCard(post);
  });
}

// =========================
//  REALTIME SUBSCRIPTION
// =========================
function subscribePosts() {
  supabase
    .from("posts")
    .on("INSERT", payload => {
      createPostCard(payload.new, true);
    })
    .subscribe();
}

// =========================
//  CREATE POST CARD
// =========================
function createPostCard(post, prepend = false) {
  const card = document.createElement("div");
  card.className = "card";

  // Random rotation
  const rotation = (Math.random() * 4 - 2).toFixed(2);
  card.style.transform = `rotate(${rotation}deg)`;

  card.innerHTML = `
    <div class="sticker">${randomSticker()}</div>
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <small>${post.user_email}</small>
  `;

  if (prepend && wall.firstChild) {
    wall.insertBefore(card, wall.firstChild);
  } else {
    wall.appendChild(card);
  }
}

// =========================
//  EXPOSE FUNCTIONS TO GLOBAL
// =========================
window.signUp = signUp;
window.logIn = logIn;
window.addPost = addPost;

