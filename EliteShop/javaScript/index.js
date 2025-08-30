document.addEventListener("DOMContentLoaded", () => {
  const navLinksDesktop = document.getElementById("nav-links-desktop");
  const navLinksMobile = document.getElementById("nav-links-mobile");
  const token = localStorage.getItem("token");

  if (token) {
    // المستخدم مسجل دخول
    navLinksDesktop.innerHTML = `
      <li>
        <button id="logoutBtnDesktop" class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full transition-all duration-300">
          Logout
        </button>
      </li>
    `;

    navLinksMobile.innerHTML = `
      <li>
        <button id="logoutBtnMobile" class="bg-orange-400 hover:bg-orange-500 text-white px-4 py-1 rounded-full transition-all duration-300">
          Logout
        </button>
      </li>
    `;

    // ربط الزرين بالـ event
    document.getElementById("logoutBtnDesktop")?.addEventListener("click", logout);
    document.getElementById("logoutBtnMobile")?.addEventListener("click", logout);

    function logout() {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }

  } else {
    // المستخدم مش مسجل دخول
    const authLinksHtml = `
      <li><a href="login.html" class="hover:text-orange-400">Login</a></li>
      <li><a href="register.html" class="hover:text-orange-400">Register</a></li>
    `;

    navLinksDesktop.innerHTML = authLinksHtml;
    navLinksMobile.innerHTML = authLinksHtml;
  }
});
