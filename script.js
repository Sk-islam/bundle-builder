const maxSelection = 3;
let selectedProducts = [];

const ctaBtn = document.getElementById("bundle-cta");
const ctaText = document.getElementById("cta-text");
const ctaIcon = document.getElementById("cta-icon");
const progressText = document.querySelector(".progress-text");
const progressBar = document.querySelector(".progress-bar span");

function updateSidebar() {
  const list = document.querySelector(".selected-products");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total-price");
  const discountEl = document.getElementById("discount-price");

  list.innerHTML = "";
  let total = 0;

  selectedProducts.forEach((p, index) => {
    const itemTotal = p.price * p.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${
        p.imageUrl
      }" style="width:60px;height:70px;object-fit:cover;margin-right:10px;border-radius:1px;" />
      <div style="flex: 1;">
        <div style="font-weight: 500;">${p.name}</div>
        <div style="color: #555;">₹${p.price.toFixed(2)}</div>
        <div style="margin-top: 6px;">
          <div style="display: flex;align-items: center;background: #f3f3f3;border: 1px solid #ccc;border-radius: 6px;padding: 4px 10px;width: fit-content;">
            <button onclick="decreaseQty(${index})" style="background:none;border:none;cursor:pointer;color:#333;font-size:1rem;"><i class="fas fa-minus"></i></button>
            <span style="margin: 0 10px;">${p.quantity}</span>
            <button onclick="increaseQty(${index})" style="background:none;border:none;cursor:pointer;color:#333;font-size:1rem;"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
      <button onclick="removeProduct(${index})" style="background:none;border:none;cursor:pointer;color:#555;margin-left:10px;">
        <i class="fas fa-trash-alt" style="font-size: 1.1rem;"></i>
      </button>
    `;
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.marginBottom = "10px";
    list.appendChild(li);
  });

  const discount = selectedProducts.length === 3 ? 0.3 * total : 0;
  const finalPrice = total - discount;

  totalEl.textContent = total.toFixed(2);
  discountEl.textContent = discount.toFixed(2);
  subtotalEl.textContent = finalPrice.toFixed(2);

  updateProgress();
  updateCTAButton();
  updateCardButtons();
}

function increaseQty(index) {
  selectedProducts[index].quantity++;
  updateSidebar();
}
function decreaseQty(index) {
  if (selectedProducts[index].quantity > 1) {
    selectedProducts[index].quantity--;
  } else {
    selectedProducts.splice(index, 1);
  }
  updateSidebar();
}
function removeProduct(index) {
  selectedProducts.splice(index, 1);
  updateSidebar();
}

function updateProgress() {
  const count = selectedProducts.length;
  progressText.textContent = `Bundle Progress: ${count} of 3`;
  progressBar.style.width = `${(count / 3) * 100}%`;
}

function updateCTAButton() {
  const count = selectedProducts.length;

  if (count < 3) {
    const remaining = 3 - count;
    ctaText.textContent = `Add ${remaining} item${
      remaining > 1 ? "s" : ""
    } to proceed`;
    ctaIcon.innerHTML = "&rsaquo;";
    ctaBtn.disabled = true;
    ctaBtn.classList.remove("enabled", "added");
  } else {
    if (!ctaBtn.classList.contains("added")) {
      ctaText.textContent = "Add Bundle to Cart";
      ctaIcon.innerHTML = "&rsaquo;";
      ctaBtn.disabled = false;
      ctaBtn.classList.add("enabled");
    }
  }
}
function updateCardButtons() {
  document.querySelectorAll(".add-btn").forEach((btn) => {
    const card = btn.closest(".product-card");
    const id = card.getAttribute("data-id");
    const exists = selectedProducts.find((p) => p.id === id);

    if (exists) {
      btn.innerHTML = 'Added to Bundle <i class="fa-solid fa-check"></i>';
      btn.classList.add("added");
    } else {
      btn.innerHTML = 'Add to Bundle <i class="fa-solid fa-plus"></i>';
      btn.classList.remove("added");
    }
  });
}

// Add button to each product card
document.querySelectorAll(".add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const id = card.getAttribute("data-id");
    const name = card.getAttribute("data-name");
    const price = parseInt(card.getAttribute("data-price"));
    const imageUrl = card.getAttribute("data-image");

    const existing = selectedProducts.find((p) => p.id === id);
    if (existing) {
      removeProduct(selectedProducts.indexOf(existing));
    } else if (selectedProducts.length < maxSelection) {
      selectedProducts.push({ id, name, price, imageUrl, quantity: 1 });
    }

    updateSidebar();
  });
});

// CTA Button Click
ctaBtn.addEventListener("click", () => {
  if (selectedProducts.length >= 3) {
    ctaText.textContent = "Added to Cart";
    ctaIcon.innerHTML = '<i class="fas fa-check"></i>';
    ctaBtn.classList.add("added");
    ctaBtn.disabled = true;
    ctaBtn.classList.remove("enabled");
  }
});

updateSidebar();
