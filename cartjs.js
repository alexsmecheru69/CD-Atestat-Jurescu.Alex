function addToCart(product) {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var index = cart.findIndex(function(item) {
      return item.id === product.id;
    });
  
    if (index !== -1) {
      cart[index].quantity++;
    } else {
      cart.push(product);
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
  
  function removeFromCart(productId) {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var index = cart.findIndex(function(item) {
      return item.id === productId;
    });
    if (index !== -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    renderCart();
  }
  
  function renderCart() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var container = document.getElementById("cart-items");
    var totalContainer = document.getElementById("cart-total");
    container.innerHTML = "";
    var total = 0;
  
    cart.forEach(function(product) {
      var li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML =
        "<div>" +
          "<h3>" + product.name + "</h3>" +
          "<span>" + (product.price * product.quantity).toFixed(2) + " EUR</span>" +
          "<span> x" + product.quantity + "</span>" +
        "</div>" +
        "<button onclick=\"removeFromCart('" + product.id + "')\">➖</button>";
      container.appendChild(li);
      total += product.price * product.quantity;
    });
  
    totalContainer.textContent = "Total: " + total.toFixed(2) + " EUR";
    renderPaypal(total.toFixed(2));
  }
  
  function renderPaypal(price) {
    var container = document.getElementById("paypal-button-container");
    container.innerHTML = "";
  
    if (price == 0) return;
  
    paypal.Buttons({
      style: {
        shape: "rect",
        color: "gold",
        layout: "vertical",
        label: "paypal"
      },
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: "EUR",
              value: price
            }
          }]
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function () {
          localStorage.setItem("cart", JSON.stringify([]));
          renderCart();
          container.innerHTML = "<h3>Thank you for your payment!</h3>";
        });
      },
      onError: function (err) {
        console.error(err);
      }
    }).render("#paypal-button-container");
  }
  
  window.onload = renderCart;