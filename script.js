// Product list: edit names, prices and emojis here
const PRODUCTS = [
  { id: 1, name: "Basmati Rice 5kg", price: 1850, cat: "Grocery", pic: "🍚" },
  { id: 2, name: "Cooking Oil 1L", price: 560, cat: "Grocery", pic: "🛢️" },
  { id: 3, name: "Sugar 1kg", price: 150, cat: "Grocery", pic: "🍬" },
  { id: 4, name: "Fresh Milk 1L", price: 220, cat: "Dairy", pic: "🥛" },
  { id: 5, name: "Eggs (dozen)", price: 380, cat: "Dairy", pic: "🥚" },
  { id: 6, name: "Yogurt 500g", price: 170, cat: "Dairy", pic: "🍶" },
  { id: 7, name: "Dish Soap", price: 240, cat: "Cleaning", pic: "🧼" },
  { id: 8, name: "Laundry Powder 1kg", price: 410, cat: "Cleaning", pic: "🧺" },
  { id: 9, name: "Biscuits Pack", price: 60, cat: "Snacks", pic: "🍪" },
  { id: 10, name: "Chips Large", price: 100, cat: "Snacks", pic: "🥔" }
];

let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch (e) { cart = []; }

const $ = (id) => document.getElementById(id);

function saveCart() {
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {}
  renderCart();
}

function addToCart(id) {
  const item = cart.find((c) => c.id === id);
  if (item) item.qty += 1; else cart.push({ id, qty: 1 });
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
}

function cardHTML(p) {
  return `<article class="card"><div class="pic">${p.pic}</div><h3>${p.name}</h3>
  <p class="price">Rs ${p.price}</p><button class="btn" type="button" data-add="${p.id}">Add to cart</button></article>`;
}

function renderProducts() {
  const box = $("products");
  if (!box) return;
  const q = $("search").value.trim().toLowerCase();
  const cat = $("category").value;
  const list = PRODUCTS.filter((p) => (cat === "all" || p.cat === cat) && p.name.toLowerCase().includes(q));
  box.innerHTML = list.map(cardHTML).join("");
  $("empty").hidden = list.length > 0;
}

function renderCart() {
  const count = cart.reduce((n, c) => n + c.qty, 0);
  $("cartCount").textContent = count;
  const ul = $("cartItems");
  if (!ul) return;
  let total = 0;
  ul.innerHTML = cart.length ? cart.map((c) => {
    const p = PRODUCTS.find((x) => x.id === c.id);
    total += p.price * c.qty;
    return `<li><span>${p.pic} ${p.name} × ${c.qty}</span><span>Rs ${p.price * c.qty} <button type="button" data-remove="${p.id}">Remove</button></span></li>`;
  }).join("") : "<li>Your cart is empty. Add items from the list above.</li>";
  $("cartTotal").textContent = total;
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.add) addToCart(Number(e.target.dataset.add));
  if (e.target.dataset.remove) removeFromCart(Number(e.target.dataset.remove));
});

if ($("featured")) $("featured").innerHTML = PRODUCTS.slice(0, 4).map(cardHTML).join("");
if ($("search")) { $("search").addEventListener("input", renderProducts); $("category").addEventListener("change", renderProducts); }
if ($("clearCart")) $("clearCart").addEventListener("click", () => { cart = []; saveCart(); });

const form = $("contactForm");
if (form) form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = $("formMsg");
  const ok = $("name").value.trim() && /^[0-9+\-\s]{7,}$/.test($("phone").value.trim()) && $("message").value.trim();
  msg.className = ok ? "ok" : "err";
  msg.textContent = ok ? "Thank you. We will call you soon." : "Enter your name, a valid phone number and a message.";
  if (ok) form.reset();
});

renderProducts();
renderCart();