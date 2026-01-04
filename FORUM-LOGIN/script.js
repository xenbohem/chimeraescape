// =======================
// SUPABASE SETUP
// =======================
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "sb_publishable_tgYPzSe_w9fyGGVZeJQ-Hg_yWZLeIW9";
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey);

// =======================
// DOM
// =======================
const authDiv = document.getElementById("auth");
const forum = document.getElementById("forum");
const userGreeting = document.getElementById("userGreeting");

const modal = document.getElementById("signupModal");
const modalUser = document.getElementById("modalUser");

// =======================
// DARK MODE
// =======================
document.getElementById("toggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// =======================
// SIGN UP
// =======================
document.getElementById("signupBtn").onclick = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  modalUser.textContent = email.split("@")[0];
  modal.style.display = "flex";
};

document.getElementById("closeModal").onclick = () => {
  modal.style.display = "none";
};

// =======================
// LOG IN
// =======================
document.getElementById("loginBtn").onclick = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
};

// =======================
// LOG OUT
// =======================
document.getElementById("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
};

// =======================
// AUTH STATE (THE BOSS)
// =======================
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    authDiv.hidden = true;
    forum.hidden = false;
    userGreeting.textContent =
      `Welcome, ${session.user.email.split("@")[0]} 🖤`;
  } else {
    authDiv.hidden = false;
    forum.hidden = true;
    userGreeting.textContent = "";
  }
});
