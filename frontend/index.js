const inquiryForm = document.getElementById("inquiryForm");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

if (inquiryForm) {
  inquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Page reload hone se rokne ke liye

    const formData = {
      name: document.getElementById("name")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      phone: document.getElementById("phone")?.value.trim() || "",
      topic: document.getElementById("topic")?.value.trim() || "General Consultancy",
      message: document.getElementById("message")?.value.trim() || ""
    };

    if (submitBtn) submitBtn.disabled = true;
    if (formStatus) formStatus.textContent = "Submitting...";

    try {
      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        if (formStatus) {
          formStatus.textContent = result.message || "Inquiry submitted successfully!";
        }
        inquiryForm.reset();
      } else if (formStatus) {
        formStatus.textContent = result.message || "Please check your inputs.";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (formStatus) {
        formStatus.textContent = "Server se rabta nahi ho saka. Check karein ke backend chal raha ha.";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function renderAuthNavbar() {
  const authNav = document.getElementById("authNav");
  if (!authNav) return;

  const savedUserRaw = localStorage.getItem("educonsult_user");
  let user = null;

  try {
    user = savedUserRaw ? JSON.parse(savedUserRaw) : null;
  } catch (err) {
    console.error("Invalid user session in localStorage:", err);
    localStorage.removeItem("educonsult_user");
  }

  if (user && (user.fullName || user.email)) {
    const displayName = user.fullName || user.email;

    authNav.innerHTML = `
      <span class="nav-user">Hi, ${displayName}</span>
      <button type="button" id="logoutBtn" class="login-btn">Logout</button>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("educonsult_user");
        window.location.reload();
      });
    }
  } else {
    authNav.innerHTML = `
      <a href="login.html" class="login-btn">Login</a>
      <a href="Register.html" class="register-btn">Apply Now</a>
    `;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderAuthNavbar);
} else {
  renderAuthNavbar();
};