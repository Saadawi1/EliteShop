// ------------------ Global Variables ------------------
const filtersContainer = document.getElementById("filters");
const productsGrid = document.getElementById("productsGrid");
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let itemToRemove = null;

// ------------------ Load Products from API ------------------
async function loadProducts() {
  try {
    const res = await fetch("https://ecommerce.routemisr.com/api/v1/products");
    const json = await res.json();
    allProducts = json.data;
    renderFilters();
    renderProducts(allProducts);
  } catch (err) {
    productsGrid.innerHTML = `<p class="col-span-full text-red-500 text-center">Failed to load products.</p>`;
    console.error(err);
  }
}

// ------------------ Render Category Filters ------------------
function renderFilters() {
  const cats = ["All", ...new Set(allProducts.map(p => p.category.name))];
  filtersContainer.innerHTML = cats.map((c, idx) => `
    <button data-cat="${c}" class="filter-btn ${idx===0 ? 'bg-warm-orange text-white' : 'bg-white text-gray-600'} px-5 py-2 rounded-full border border-gray-300 hover:bg-warm-orange hover:text-white transition">
      ${c}
    </button>
  `).join("");

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("bg-warm-orange","text-white");
        b.classList.add("bg-white","text-gray-600");
      });
      btn.classList.remove("bg-white","text-gray-600");
      btn.classList.add("bg-warm-orange","text-white");

      const cat = btn.dataset.cat;
      renderProducts(cat === "All" ? allProducts : allProducts.filter(p => p.category.name === cat));
    });
  });
}

// ------------------ Render Products Grid ------------------
function renderProducts(list) {
  productsGrid.innerHTML = list.map((p, idx) => `
    <div class="bg-white rounded-2xl shadow-md overflow-hidden animate-fade-in">
      <span class="inline-block bg-warm-orange text-white text-xs font-medium px-3 py-1 rounded-full m-4">${p.category.name}</span>
      <img src="${p.imageCover}" alt="${p.title}" class="w-full h-52 object-contain bg-cream-white"/>
      <div class="p-4 flex flex-col">
        <h4 class="text-gray-800 font-semibold text-lg mb-2 truncate">${p.title}</h4>
        <p class="text-warm-orange font-bold mb-2">$${p.price.toFixed(2)}</p>
        <div class="text-yellow-400 text-sm mb-4">★ ${p.ratingsAverage || 0} (${p.ratingsQuantity || 0})</div>
        <button class="mt-auto bg-warm-orange hover:bg-light-orange text-white py-2 rounded-xl font-medium transition">Add to Cart</button>
      </div>
    </div>
  `).join("");

  attachAddToCartEvents(list);
}

// ------------------ Attach Add to Cart Buttons ------------------
function attachAddToCartEvents(list) {
  const addButtons = document.querySelectorAll('#productsGrid button');
  addButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      addToCart(list[index]);
    });
  });
}

// ------------------ Add Product to Cart ------------------
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ 
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.imageCover,
      quantity: 1
    });
  }

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
  showToast("Cart updated");
}

// ------------------ Confirm Remove Item ------------------
function confirmRemoveItem(index) {
  itemToRemove = index;
  const popup = document.getElementById("confirmPopup");
  popup.classList.remove("pointer-events-none", "opacity-0");
  popup.querySelector("div").classList.remove("scale-75");
  popup.querySelector("div").classList.add("scale-100");
}

// ------------------ Popup Buttons ------------------
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

// ------------------ Mobile Menu Toggle ------------------
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  menuBtn.textContent = mobileMenu.classList.contains("hidden") ? "☰" : "✖";
});

// ------------------ Cart Sidebar Toggle ------------------
const cartBtnDesktop = document.getElementById("cartBtnDesktop");
const cartBtnMobile = document.getElementById("cartBtnMobile");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");

cartBtnDesktop?.addEventListener("click", () => cartSidebar.classList.toggle("translate-x-full"));
cartBtnMobile?.addEventListener("click", () => cartSidebar.classList.toggle("translate-x-full"));
closeCart?.addEventListener("click", () => cartSidebar.classList.add("translate-x-full"));

// ------------------ Initialize ------------------
loadProducts();
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

