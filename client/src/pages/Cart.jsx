import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Badge,
} from "react-bootstrap";
import {
  FaStar,
  FaTrashAlt,
  FaShoppingCart,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../context/AuthContext";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    total,
    itemCount,
    cartLoading,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const theme = "light";

  const handleQuantityChange = (cartItemId, delta) => {
    const book = cartItems.find((b) => b.cartItemId === cartItemId);

    if (!book) return;

    const newQty = book.quantity + delta;

    if (newQty < 1) return;

    updateQuantity(cartItemId, newQty);
  };

  if (cartLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-muted">Loading your cart...</p>
      </div>
    );
  }

  return (
    <Container
      fluid
      className="py-5 bg-light text-dark"
      style={{ minHeight: "80vh" }}
    >
      <ToastContainer theme="light" />

      {/* Page Title */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold">
          <FaShoppingCart className="me-2 text-warning" />
          Your Cart
        </h2>

        <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
          {itemCount} items
        </Badge>
      </div>

      <Row>
        {/* ================= CART ITEMS ================= */}
        <Col lg={8}>
          {cartItems.length === 0 ? (
            <Card
              className="text-center p-5 border-0 shadow-sm"
              style={{ borderRadius: "16px" }}
            >
              <h4 className="fw-semibold mb-2">Your cart is empty 📚</h4>
              <p className="text-muted">
                Looks like you haven't added any books yet.
              </p>

              <Button
                style={{
                  background: "linear-gradient(45deg,#ffb347,#ffcc33)",
                  border: "none",
                  fontWeight: "600",
                  padding: "10px 20px",
                }}
                onClick={() => window.history.back()}
              >
                Browse Books
              </Button>
            </Card>
          ) : (
            cartItems.map((book) => (
              <motion.div
                key={book.cartItemId}
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="mb-3 p-3 border-0 shadow-sm"
                  style={{
                    borderRadius: "16px",
                    background: "#ffffff",
                  }}
                >
                  <Row className="align-items-center">
                    {/* Book Image */}
                    <Col md={2}>
                      <Image
                        src={book.image}
                        rounded
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </Col>

                    {/* Book Info */}
                    <Col md={4}>
                      <h6 className="fw-bold mb-1">{book.title}</h6>
                      <p className="mb-1 text-muted">{book.author}</p>

                      <small className="text-muted">
                        {book.format} | Stock: {book.stock}
                      </small>

                      {/* Ratings */}
                      <div className="mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            color={
                              i < Math.round(book.rating) ? "#ffc107" : "#ddd"
                            }
                            size={14}
                          />
                        ))}

                        <span className="ms-2 text-muted">
                          ({book.reviewCount})
                        </span>
                      </div>
                    </Col>

                    {/* Quantity */}
                    <Col md={3} className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() =>
                            handleQuantityChange(book.cartItemId, -1)
                          }
                        >
                          <FaMinus />
                        </Button>

                        <span className="fw-bold fs-6">{book.quantity}</span>

                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() =>
                            handleQuantityChange(book.cartItemId, 1)
                          }
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </Col>

                    {/* Price */}
                    <Col md={2} className="text-center">
                      <p className="fw-bold mb-0">
                        $
                        {(
                          (book.discountPrice || book.price) * book.quantity
                        ).toFixed(2)}
                      </p>

                      {book.discountPrice && (
                        <small className="text-decoration-line-through text-muted">
                          ${book.price.toFixed(2)}
                        </small>
                      )}
                    </Col>

                    {/* Remove */}
                    <Col md={1} className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(book.cartItemId)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </motion.div>
            ))
          )}
        </Col>

        {/* ================= ORDER SUMMARY ================= */}
        <Col lg={4}>
          <Card
            className="p-4 shadow-sm border-0"
            style={{
              borderRadius: "16px",
              position: "sticky",
              top: "120px",
              background: "#ffffff",
            }}
          >
            <h5 className="mb-3 fw-semibold">Order Summary</h5>

            <hr />

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button
              className="w-100 mb-2"
              style={{
                background: "linear-gradient(45deg,#ffb347,#ffcc33)",
                border: "none",
                fontWeight: "600",
                padding: "10px",
              }}
              onClick={() => navigate("/checkout")}
            >
              <FaShoppingCart className="me-2" />
              Proceed to Checkout
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => window.history.back()}
            >
              Continue Shopping
            </Button>

            {cartItems.length > 0 && (
              <Button
                variant="outline-danger"
                className="w-100 mt-2"
                onClick={() => {
                  clearCart();
                  toast.info("Cart cleared", { position: "top-center" });
                }}
              >
                Clear Cart
              </Button>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}