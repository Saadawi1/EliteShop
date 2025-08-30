// جلب السلة من localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");

// عرض المنتجات
function renderCheckout() {
  checkoutItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b pb-2";

    div.innerHTML = `
      <div>
        <h4 class="font-semibold">${item.title}</h4>
        <p>$${item.price} x ${item.quantity}</p>
      </div>
      <p class="font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
    `;

    checkoutItems.appendChild(div);
  });

  checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

renderCheckout();

// ------------------ Proceed to Payment ------------------
document.getElementById("proceedPayment").addEventListener("click", async () => {
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
    localStorage.removeItem("cart"); // تفريغ السلة بعد الدفع
    window.location.href = data.sessionUrl;

  } catch (err) {
    console.error(err);
    alert("Error creating checkout session");
  }
});
