// ------------------ Cart State ------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ------------------ Update Cart UI ------------------
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
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
        <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-600 ml-2">
          🗑️
        </button>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// ------------------ Change Quantity ------------------
function changeQty(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// ------------------ Checkout ------------------
async function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const lineItems = cart.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/orders/checkout-session/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: lineItems }),
    });

    if (!res.ok) throw new Error("Failed to create checkout session");

    const data = await res.json();
    window.location.href = data.sessionUrl; // تحويل المستخدم لصفحة الدفع
  } catch (err) {
    console.error(err);
    alert("Error creating checkout session");
  }
}

// ربط الزر بالوظيفة
const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", checkout);
}

// ------------------ Remove Item ------------------
let itemToRemove = null;

function removeItem(index) {
  itemToRemove = index;
  const popup = document.getElementById("confirmPopup");
  popup.classList.remove("pointer-events-none");
  popup.classList.remove("opacity-0");
  popup.querySelector("div").classList.remove("scale-75");
  popup.querySelector("div").classList.add("scale-100");
}

// زر Yes
document.getElementById("confirmYes").addEventListener("click", () => {
  if (itemToRemove !== null) {
    cart.splice(itemToRemove, 1);
    updateCartUI();
    showToast("Item removed from cart");
    itemToRemove = null;
  }
  closePopup();
});

// زر No
document.getElementById("confirmNo").addEventListener("click", closePopup);

function closePopup() {
  const popup = document.getElementById("confirmPopup");
  popup.classList.add("opacity-0");
  popup.classList.add("pointer-events-none");
  popup.querySelector("div").classList.remove("scale-100");
  popup.querySelector("div").classList.add("scale-75");
}


// ------------------ Add to Cart ------------------
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`${product.title} added to cart`);
}

// ------------------ Toast ------------------
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

// ------------------ Sidebar Toggle ------------------
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartBtnMobile = document.getElementById("cartBtnMobile");
cartBtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("translate-x-full");
});
cartBtnMobile.addEventListener("click", () => {
    cartSidebar.classList.toggle("translate-x-full");
});
closeCart.addEventListener("click", () => {
  cartSidebar.classList.add("translate-x-full");
});

// ------------------ Load Categories ------------------
async function loadCategories() {
  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories");
    const data = await res.json();

    const slider = document.getElementById("slider");
    slider.innerHTML = "";

    data.data.forEach((cat) => {
      const div = document.createElement("div");
      div.className =
        "category-card bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition";
      div.innerHTML = `
        <img src="${cat.image}" alt="${cat.name}" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="text-lg font-semibold text-gray-700">${cat.name}</h3>
      `;
      slider.appendChild(div);
    });

    slider.innerHTML += slider.innerHTML;
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

loadCategories();

// ------------------ Load Products ------------------
async function loadProducts() {
  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/products");
    const data = await res.json();
    const products = data.data;

    const container = document.getElementById("homeProducts");
    container.innerHTML = "";

    products.slice(7, 19).forEach((product) => {
      const div = document.createElement("div");
      div.className =
        "bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 flex flex-col";

      div.innerHTML = `
        <div class="relative w-full h-64 flex items-center justify-center bg-gray-50 rounded-t-2xl overflow-hidden">
          <img src="${product.imageCover}" alt="${product.title}" 
            class="object-contain w-full h-full p-4 transition duration-300 hover:scale-105">
          <span class="absolute top-3 left-3 bg-warm-orange text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            ${product.category.name}
          </span>
        </div>
        <div class="p-5 flex flex-col flex-1">
          <h4 class="font-semibold text-gray-800 mb-2 text-lg truncate">${product.title}</h4>
          <p class="text-warm-orange font-bold text-xl mb-2">$${product.price}</p>
          <div class="flex items-center mb-4">
            <span class="text-yellow-400">★</span>
            <span class="ml-1 text-gray-600 text-sm">${product.ratingsAverage || 0} (${product.ratingsQuantity || 0})</span>
          </div>
          <button class="mt-auto bg-warm-orange hover:bg-light-orange text-white py-3 rounded-xl font-medium transition shadow-md hover:shadow-xl">
            Add to Cart
          </button>
        </div>
      `;

      const btn = div.querySelector("button");
      btn.addEventListener("click", () => {
        addToCart({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.imageCover,
        });
      });

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

loadProducts();

// ------------------ Toggle Menu in Mobile ------------------
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  menuBtn.textContent = mobileMenu.classList.contains("hidden") ? "☰" : "✖";
});

// ------------------ Init ------------------
updateCartUI();

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

