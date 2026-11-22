
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [showCart, setShowCart] = useState(false);
  const [authMode, setAuthMode] = useState("");

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopeaseUser"));
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("shopeaseToken") || ""
  );

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (price) =>
    "₹" + Number(price || 0).toLocaleString("en-IN");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  // Fetch products from MongoDB through backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Unable to load products.");
      }

      const data = await response.json();

      const formattedProducts = data.map((product) => ({
        ...product,
        id: product._id,
        name: String(product.name || "").trim(),
        category: String(product.category || "").trim(),
        rating: product.rating || 4.5,
      }));

      setProducts(formattedProducts);
    } catch (error) {
      showMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logged-in user's orders
  const fetchOrders = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to load your orders.");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      showMessage(error.message);
    }
  };

  // Load products and saved login information
  useEffect(() => {
    fetchProducts();

    const savedToken = localStorage.getItem("shopeaseToken");

    if (savedToken && user) {
      fetchOrders(savedToken);
    }
  }, []);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Corrected product search and category filtering
  const filteredProducts = products.filter((product) => {
    const productName = String(product.name || "").toLowerCase().trim();

    const productCategory = String(product.category || "")
      .toLowerCase()
      .trim();

    const searchText = search.toLowerCase().trim();
    const selectedCategory = category.toLowerCase().trim();

    const matchesSearch = productName.includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      productCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Add product to cart
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    const currentQuantity = existing ? existing.quantity : 0;

    if (product.stock <= currentQuantity) {
      showMessage("Sorry, this product is out of stock.");
      return;
    }

    setCart((previousCart) => {
      if (existing) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });

    showMessage("Product added to your cart!");
  };

  // Change cart quantity
  const changeQuantity = (id, amount) => {
    setCart((previousCart) =>
      previousCart
        .map((item) => {
          if (item.id !== id) return item;

          const newQuantity = item.quantity + amount;

          if (newQuantity > item.stock) {
            showMessage("Available stock limit reached.");
            return item;
          }

          return { ...item, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );

    showMessage("Product removed from cart.");
  };

  // Register or login using backend
  const handleAuth = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      if (authMode === "register") {
        const registerResponse = await fetch(
          `${API_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          throw new Error(
            registerData.message || "Registration failed."
          );
        }
      }

      // Login after registration, or directly for existing users
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Login failed.");
      }

      setUser(loginData.user);
      setToken(loginData.token);

      localStorage.setItem(
        "shopeaseUser",
        JSON.stringify(loginData.user)
      );

      localStorage.setItem("shopeaseToken", loginData.token);

      setAuthMode("");
      showMessage("Welcome to ShopEase!");

      await fetchOrders(loginData.token);
    } catch (error) {
      showMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Place order through backend
  const placeOrder = async () => {
    if (!user || !token) {
      setShowCart(false);
      setAuthMode("login");
      showMessage("Please login before placing your order.");
      return;
    }

    if (cart.length === 0 || submitting) return;

    setSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to place order.");
      }

      setCart([]);
      setShowCart(false);
      setActivePage("orders");

      await fetchOrders(token);
      await fetchProducts();

      showMessage("Your order has been placed successfully!");
    } catch (error) {
      showMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken("");
    setOrders([]);

    localStorage.removeItem("shopeaseUser");
    localStorage.removeItem("shopeaseToken");

    showMessage("You have logged out.");
  };

  const scrollToProducts = () => {
    setActivePage("home");

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <a
          href="#home"
          className="logo"
          onClick={() => setActivePage("home")}
        >
          Shop<span>Ease</span>
        </a>

        <div className="nav-links">
          <button onClick={() => setActivePage("home")}>
            Home
          </button>

          <button onClick={scrollToProducts}>
            Products
          </button>

          <button
            onClick={() => {
              if (user) fetchOrders(token);
              setActivePage("orders");
            }}
          >
            My Orders
          </button>

          {user ? (
            <button onClick={logout}>
              Logout ({user.name})
            </button>
          ) : (
            <button onClick={() => setAuthMode("login")}>
              Login
            </button>
          )}

          <button
            className="cart-btn"
            onClick={() => setShowCart(true)}
          >
            🛒 Cart ({cartCount})
          </button>
        </div>
      </nav>

      {/* NOTIFICATION */}
      {message && (
        <div className="notification">
          {message}
        </div>
      )}

      {/* HOME PAGE */}
      {activePage === "home" && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <p className="tagline">WELCOME TO SHOEASE</p>

              <h1>
                Discover Your
                <br />
                Everyday Essentials.
              </h1>

              <p className="hero-description">
                Find quality products at amazing prices.
                Shop your favourites in one place.
              </p>

              <button
                className="primary-btn"
                onClick={scrollToProducts}
              >
                Shop Now →
              </button>
            </div>
          </section>

          {/* BENEFITS */}
          <section className="benefits">
            <div>
              <span>🚚</span>
              <h3>Fast Delivery</h3>
              <p>Convenient doorstep delivery</p>
            </div>

            <div>
              <span>🔒</span>
              <h3>Secure Shopping</h3>
              <p>Shop with confidence</p>
            </div>

            <div>
              <span>⭐</span>
              <h3>Quality Products</h3>
              <p>Products selected for you</p>
            </div>
          </section>

          {/* PRODUCTS */}
          <section className="products-section" id="products">
            <div className="section-heading">
              <p className="tagline">OUR COLLECTION</p>
              <h2>Featured Products</h2>
              <p>Explore our latest collection</p>
            </div>

            {/* SEARCH */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <span>🔍</span>
            </div>

            {/* CATEGORY FILTER */}
            <div className="category-filter">
              {["All", "Electronics", "Fashion", "Home"].map(
                (item) => (
                  <button
                    key={item}
                    className={
                      category === item ? "active-category" : ""
                    }
                    onClick={() => {
                      setCategory(item);
                      setSearch("");
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            {/* PRODUCT GRID */}
            <div className="product-grid">
              {loading ? (
                <p className="empty-message">
                  Loading products...
                </p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    className="product-card"
                    key={product.id}
                  >
                    <div
                      className="product-image"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      <span className="category-label">
                        {product.category}
                      </span>
                    </div>

                    <div className="product-info">
                      <p className="rating">
                        ⭐ {product.rating}
                      </p>

                      <h3>{product.name}</h3>

                      <p className="product-price">
                        {formatPrice(product.price)}
                      </p>

                      <button
                        className="add-btn"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="details-btn"
                        onClick={() => setSelectedProduct(product)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">
                  No products found. Try another search.
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* PRODUCT DETAILS */}
      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="modal product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />

            <div>
              <p className="tagline">
                {selectedProduct.category}
              </p>

              <h2>{selectedProduct.name}</h2>

              <p>⭐ {selectedProduct.rating} / 5</p>

              <h3 className="product-price">
                {formatPrice(selectedProduct.price)}
              </h3>

              <p>{selectedProduct.description}</p>

              <p>
                Available stock: {selectedProduct.stock}
              </p>

              <button
                className="primary-btn"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {showCart && (
        <div
          className="modal-overlay"
          onClick={() => setShowCart(false)}
        >
          <div
            className="modal cart-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setShowCart(false)}
            >
              ×
            </button>

            <h2>Your Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started.</p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setShowCart(false);
                    scrollToProducts();
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>

                        <p>{formatPrice(item.price)}</p>

                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              changeQuantity(item.id, -1)
                            }
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              changeQuantity(item.id, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <p>
                    Subtotal:
                    <strong>{formatPrice(cartTotal)}</strong>
                  </p>

                  <p>
                    Delivery:
                    <strong>FREE</strong>
                  </p>

                  <h3>
                    Total:
                    <span>{formatPrice(cartTotal)}</span>
                  </h3>

                  <button
                    className="checkout-btn"
                    onClick={placeOrder}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Processing..."
                      : "Proceed to Checkout"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* LOGIN AND REGISTER */}
      {authMode && (
        <div
          className="modal-overlay"
          onClick={() => setAuthMode("")}
        >
          <div
            className="modal auth-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setAuthMode("")}
            >
              ×
            </button>

            <h2>
              {authMode === "login"
                ? "Welcome Back!"
                : "Create Your Account"}
            </h2>

            <p>Continue shopping with ShopEase.</p>

            <form onSubmit={handleAuth}>
              {authMode === "register" && (
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              )}

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                minLength="6"
                required
              />

              <button
                type="submit"
                className="checkout-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Login"
                    : "Register"}
              </button>
            </form>

            <p className="switch-auth">
              {authMode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() =>
                  setAuthMode(
                    authMode === "login" ? "register" : "login"
                  )
                }
              >
                {authMode === "login" ? " Register" : " Login"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* MY ORDERS */}
      {activePage === "orders" && (
        <section className="orders-section">
          <h1>My Orders</h1>
          <p>View your recent shopping orders.</p>

          {!user ? (
            <div className="empty-cart">
              <h3>Please login to view your orders.</h3>

              <button
                className="primary-btn"
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-cart">
              <span>📦</span>
              <h3>No orders yet</h3>

              <button
                className="primary-btn"
                onClick={() => setActivePage("home")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                className="order-card"
                key={order._id}
              >
                <h3>
                  Order #{order._id.slice(-8)}
                </h3>

                <p>
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>

                <p>Status: {order.status}</p>

                <p>
                  Items:{" "}
                  {order.items
                    .map((item) => {
                      const productName =
                        item.product?.name || "Product";

                      return `${productName} × ${item.quantity}`;
                    })
                    .join(", ")}
                </p>

                <h3>{formatPrice(order.totalAmount)}</h3>
              </div>
            ))
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer" id="about">
        <h2>ShopEase</h2>
        <p>Your everyday shopping destination.</p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
        </div>

        <p className="copyright">
          © 2026 ShopEase. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
