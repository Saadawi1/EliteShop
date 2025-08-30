  // ✅ Toggle Menu in Mobile + تغيير الايقونة
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");

    if (mobileMenu.classList.contains("hidden")) {
      menuBtn.textContent = "☰"; // يفتح
    } else {
      menuBtn.textContent = "✖"; // يقفل
    }
  });

// ------------------ Contact Form with EmailJS ------------------
  (function(){
    emailjs.init("kUcaxeInmsZasW-lM"); // استبدل بالـ Public Key الخاص بك
  })();

  document.getElementById("contact-form").addEventListener("submit", function(event){
    event.preventDefault();
    emailjs.sendForm("service_vmagbjq", "template_7qbqzwq", this)
      .then(function(){
        document.getElementById("status").innerText = "Message sent successfully!";
        document.getElementById("contact-form").reset();
      }, function(error){
        document.getElementById("status").innerText = "Failed: " + JSON.stringify(error);
      });
  });


// ------------------ Cart Sidebar ------------------

// Cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let itemToRemove = null;

// ------------------ Add to Cart ------------------
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity++;
  else cart.push({ id: product.id, title: product.title, price: product.price, image: product.imageCover, quantity: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
  showToast(`${product.title} added to cart`);
}

// ------------------ Update Cart UI ------------------
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b pb-2";
    div.innerHTML = `
      <div class="flex items-center space-x-2">
        <img src="${item.image}" class="w-12 h-12 rounded object-cover"/>
        <div>
          <h4 class="text-sm font-semibold">${item.title}</h4>
          <p class="text-xs text-gray-500">$${item.price}</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="changeQty(${index}, -1)" class="px-2 bg-gray-200 rounded">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${index}, 1)" class="px-2 bg-gray-200 rounded">+</button>
        <button onclick="confirmRemoveItem(${index})" class="text-red-500 hover:text-red-600 ml-2">🗑️</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
  updateCartCount();
}

// ------------------ Update Cart Count ------------------
function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCountDesktop").textContent = totalQty;
  document.getElementById("cartCountMobile").textContent = totalQty;
}

// ------------------ Change Quantity ------------------
function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// ------------------ Remove Item with Popup ------------------
function confirmRemoveItem(index) {
  itemToRemove = index;
  const popup = document.getElementById("confirmPopup");
  popup.classList.remove("pointer-events-none", "opacity-0");
  popup.querySelector("div").classList.remove("scale-75");
  popup.querySelector("div").classList.add("scale-100");
}
document.getElementById("confirmYes").addEventListener("click", () => {
  if (itemToRemove !== null) {
    cart.splice(itemToRemove, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
    showToast("Item removed from cart");
    itemToRemove = null;
  }
  closePopup();
});
document.getElementById("confirmNo").addEventListener("click", closePopup);
function closePopup() {
  const popup = document.getElementById("confirmPopup");
  popup.classList.add("opacity-0", "pointer-events-none");
  popup.querySelector("div").classList.remove("scale-100");
  popup.querySelector("div").classList.add("scale-75");
}

// ------------------ Toast ------------------
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

// ------------------ Sidebar Toggle ------------------
const cartBtnDesktop = document.getElementById("cartBtnDesktop");
const cartBtnMobile = document.getElementById("cartBtnMobile");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");

cartBtnDesktop?.addEventListener("click", () => cartSidebar.classList.toggle("translate-x-full"));
cartBtnMobile?.addEventListener("click", () => cartSidebar.classList.toggle("translate-x-full"));
closeCart?.addEventListener("click", () => cartSidebar.classList.add("translate-x-full"));

// ------------------ Initialize ------------------
updateCartUI();
// ------------------ End of Cart Sidebar ------------------
// ------------------ Back to Top Button ------------------
// زرار Scroll To Top
const backToTop = document.getElementById("backToTop");

// إظهار الزرار عند النزول
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) { 
    backToTop.classList.remove("opacity-0", "invisible");
    backToTop.classList.add("opacity-100", "visible");
  } else {
    backToTop.classList.add("opacity-0", "invisible");
    backToTop.classList.remove("opacity-100", "visible");
  }
});

// لما المستخدم يضغط يرجع فوق
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

