function triggerModal(message) {
  const overlay = document.querySelector('.overlay'),
        modal = document.querySelector('.modal'),
        modalMsg = document.querySelector('.modal-message');

  modalMsg.innerText = message;
  modal.classList.add('active');
  overlay.classList.add('active');
};

function closeModal() {
  const overlay = document.querySelector('.overlay'),
        modal = document.querySelector('.modal');

  modal.classList.remove('active');
  overlay.classList.remove('active');
};

function checkCartEmpty() {
  const cartEmpty = document.querySelector('.cart-empty'),
        cartItemsContainer = document.querySelector('.cart-items');

  if (cartItemsContainer.childElementCount > 1) { // Ignore cart header row
    cartEmpty.style.display = 'none';
  } else {
    cartEmpty.style.display = 'block';
  }
};

function checkDuplicateItem(cartItemNames, title) {
  let bool = false;

  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      triggerModal('This item has already been added to the cart.');
      bool = true;
      break;
    }
  }

  return bool;
};

function removeCartItem(e) {
  const btnClicked = e.target;

  // Remove cart item row
  btnClicked.parentElement.parentElement.remove();

  updateCartTotal();
  checkCartEmpty();
};

function updateQuantity(e) {
  const input = e.target;

  // Prevent invalid quantity
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }

  updateCartTotal();
};

function addItemToCart(title, price, imageSrc) {
  const cartRow = document.createElement('div'),
        cartItemsContainer = document.querySelector('.cart-items');

  // Build new cart item
  cartRow.classList.add('cart-row');

  const cartRowContents = `
    <div class="cart-item cart-column">
      <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
      <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
      <input class="cart-quantity-input" type="number" value="1">
      <div class="btn-remove" type="button">&times;</div>
    </div>
  `;

  // Update cart with added item
  cartRow.innerHTML = cartRowContents;
  cartItemsContainer.append(cartRow);

  // Add event listener to cart item remove button
  cartRow.querySelector('.btn-remove').addEventListener('click', removeCartItem);
  // Add event listener to cart item quantity
  cartRow.querySelector('.cart-quantity-input').addEventListener('change', updateQuantity);

  // Remove empty cart message
  checkCartEmpty();
};

function updateCartTotal() {
  const cartItemContainer = document.querySelector('.cart-items'),
        cartRows = cartItemContainer.querySelectorAll('.cart-row'),
        cartTotalEl = document.querySelector('.cart-total-price'),
        discount = parseFloat(localStorage.getItem('discountAmount'));
  let total = 0;

  cartRows.forEach(row => {
    const priceEl = row.querySelector('.cart-price'),
          quantityEl = row.querySelector('.cart-quantity-input');
    
    const price = parseFloat(priceEl.innerText.replace('£', '')), // Convert price string to number
          quantity = quantityEl.value;

    total = total + (price * quantity);
    total = total - ((total / 100) * discount);
  });

  cartTotalEl.innerText = '£' + total.toFixed(2);
}

function addToCartClicked(e) {
  const btn = e.target,
        shopItem = btn.parentElement.parentElement,
        title = shopItem.querySelector('.shop-item-title').innerText,
        price = shopItem.querySelector('.shop-item-price').innerText,
        imageSrc = shopItem.querySelector('.shop-item-image').src,
        cartItemNames = document.querySelectorAll('.cart-item-title');

  if (checkDuplicateItem(cartItemNames, title)) {
    return;
  } else {
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
    // Navigate to cart
    document.location = '#cart';
  }
};

function checkDiscountCode() {
  let discountCodes = JSON.parse(localStorage.getItem('discountCodes')),
      usedDiscountCodes = JSON.parse(localStorage.getItem('usedDiscountCodes')),
      discountCodeInput = document.querySelector('.input-discount-code'),
      discountCode = discountCodeInput.value.toLowerCase(),
      discountInfo = document.querySelector('.cart-total-discount');

  if (discountCode !== '') {
    const usedDiscountMatch = usedDiscountCodes.map(discount => discount['code']).indexOf(discountCode),
          newDiscountMatch = discountCodes.map(discount => discount['code']).indexOf(discountCode);

    for (let i = 0; i < discountCodes.length; i++) {
      if (usedDiscountMatch > -1) {
        triggerModal('Sorry, that discount code has already been applied.');
        break;
      } else if (newDiscountMatch > -1) {
        // Set discount code
        const amount = discountCodes[newDiscountMatch].amount;
        localStorage.setItem('discountAmount', amount);
        discountInfo.innerText = `Discount: ${amount}%`;
        // Update discount code records
        usedDiscountCodes.push({ code: discountCode, amount: amount });
        discountCodes.splice(newDiscountMatch, 1);
        localStorage.setItem('usedDiscountCodes', JSON.stringify(usedDiscountCodes));
        localStorage.setItem('discountCodes', JSON.stringify(discountCodes));

        updateCartTotal();
        triggerModal(`${amount}% discount applied!`);
        break;
      } else {
        triggerModal("Sorry, that discount code isn't valid.");
        break;
      }
    }
  } else {
    triggerModal("Sorry, that discount code isn't valid.");
  }

  // Reset discount code input
  discountCodeInput.value = '';
};

function clearCart() {
  const cartItemsContainer = document.querySelector('.cart-items'),
        cartRows = document.querySelectorAll('.cart-row');

  if (cartRows.length > 1) { // Ignore cart header row
    for (let i = 0; i < cartRows.length; i++) {
      cartItemsContainer.removeChild(cartItemsContainer.lastChild);
    }
  } else {
    triggerModal('Cart is already empty.');
  }

  updateCartTotal();
  checkCartEmpty();
};

// Empty cart on purchase / Alert empty cart
function purchaseClicked() {
  const cartItemsContainer = document.querySelector('.cart-items'),
        cartRows = document.querySelectorAll('.cart-row');

  if (cartRows.length > 1) {
    triggerModal('Thank you for your purchase!');

    for (let i = 0; i < cartRows.length; i++) {
      cartItemsContainer.removeChild(cartItemsContainer.lastChild);
    }

    updateCartTotal();
  } else {
    triggerModal('Please add an item to the cart...');
  }
}

function setEventListeners() {
  const addToCartBtn = document.querySelectorAll('.btn-shop-item'),
        quantityInputs = document.querySelectorAll('.cart-quantity-input'),
        removeCartItemBtns = document.querySelectorAll('.btn-remove'),
        discountSubmit = document.querySelector('.btn-discount'),
        clearCartBtn = document.querySelector('.btn-clear-cart'),
        purchaseBtn = document.querySelector('.btn-purchase'),
        overlay = document.querySelector('.overlay'),
        closeModalBtn = document.querySelector('.btn-modal-close');

  addToCartBtn.forEach(btn => {
    btn.addEventListener('click', addToCartClicked);
  });

  quantityInputs.forEach(input => {
    input.addEventListener('change', updateQuantity);
  });

  removeCartItemBtns.forEach(btn => {
    btn.addEventListener('click', removeCartItem);
  });

  discountSubmit.addEventListener('click', checkDiscountCode);

  clearCartBtn.addEventListener('click', clearCart);

  purchaseBtn.addEventListener('click', purchaseClicked);

  closeModalBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

function setDiscountCodes() {
  const discountCodes = [
    { code: 'code10', amount: 10},
    { code: 'code20', amount: 20},
    { code: 'code30', amount: 30},
    { code: 'code40', amount: 40},
    { code: 'code50', amount: 50},
    { code: 'code60', amount: 60},
    { code: 'code70', amount: 70},
    { code: 'code80', amount: 80}
  ],
  usedDiscountCodes = [];

  if (localStorage.getItem('discountCodes')) {
    return;
  } else {
    localStorage.setItem('discountCodes', JSON.stringify(discountCodes));
    localStorage.setItem('usedDiscountCodes', JSON.stringify(usedDiscountCodes));
  }
}

setDiscountCodes();
setEventListeners();