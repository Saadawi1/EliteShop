// login.js
document.addEventListener("DOMContentLoaded", () => {
    const toastContainer = document.getElementById("toastContainer");
    const loadingOverlay = document.getElementById("loadingOverlay");

    function showToast(message, type = "success") {
      const toast = document.createElement("div");
      toast.className = `px-4 py-3 rounded shadow-md text-white transition-all duration-300 ${
        type === "success" ? "bg-soft-green" : "bg-warm-orange"
      }`;
      toast.textContent = message;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-[-10px]");
        setTimeout(() => toast.remove(), 500);
      }, 2500);
    }

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      loadingOverlay.classList.remove("hidden"); // Show loading

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          showToast("Login successful!", "success");
          setTimeout(() => window.location.href = "home.html", 1000);
        } else {
          showToast(data.message || "Login failed", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("Something went wrong!", "error");
      } finally {
        loadingOverlay.classList.add("hidden"); // Hide loading
      }
    });
})