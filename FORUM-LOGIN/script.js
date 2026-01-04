// =======================
// SUPABASE SETUP
// =======================
const supabaseUrl = "https://xetcjpoxdyrzfcionohq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldGNqcG94ZHlyemZjaW9ub2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MzY3MzEsImV4cCI6MjA4MzAxMjczMX0.658Q1QUpw11rnNCkNyGKuk4UJ9ERwKZqVIOTKDUxODs";
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
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
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
  showToast("You’ve logged out safely ✂️");
};
// =======================
// AUTH STATE (THE BOSS)
// =======================
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    authDiv.hidden = true;
    forum.hidden = false;
    userGreeting.textContent =
      `salutations, ${session.user.email.split("@")[0]} 🖤`;
  } else {
    authDiv.hidden = false;
    forum.hidden = true;
    userGreeting.textContent = "";
  }
});
