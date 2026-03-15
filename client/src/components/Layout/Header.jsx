import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Badge, Offcanvas, Button } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Header() {

  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();

  const [isSticky, setIsSticky] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgClass = isSticky
    ? "bg-white shadow-lg backdrop-blur"
    : "bg-transparent";

  const avatarUrl = user?.avatar
    ? `http://localhost:5000${user.avatar}`
    : null;

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        className={`transition-navbar ${bgClass}`}
        variant={"light"}
      >
        <Container>

          {/* LOGO */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-4 d-flex align-items-center"
          >
            <img src="/images/logo.png" alt="InkSpire" width="70px" />
          </Navbar.Brand>

          {/* MOBILE TOGGLE */}
          <Button
            variant="outline-warning"
            className="d-lg-none rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "42px", height: "42px" }}
            onClick={() => setShowOffcanvas(true)}
          >
            <FaBars />
          </Button>

          {/* DESKTOP NAV */}
          <Navbar.Collapse className="d-none d-lg-flex">

            <Nav className="ms-auto align-items-center gap-3">

              <Nav.Link as={NavLink} to="/books" className="fw-medium">
                Books
              </Nav.Link>

              {!isAuthenticated ? (
                <>
                  <Nav.Link as={NavLink} to="/about">
                    About
                  </Nav.Link>

                  <Nav.Link as={NavLink} to="/contact">
                    Contact
                  </Nav.Link>

                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>

                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/profile"
                    className="d-flex align-items-center gap-2"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #ffc107"
                        }}
                      />
                    ) : (
                      <FaUser />
                    )}

                    {user.name}
                  </Nav.Link>

                  <Nav.Link onClick={logout}>
                    Logout
                  </Nav.Link>
                </>
              )}

              {/* CART */}
              <Nav.Link
                as={NavLink}
                to="/cart"
                className="position-relative"
              >
                <FaShoppingCart size={18} />

                {cartCount > 0 && (
                  <Badge
                    bg="warning"
                    pill
                    className="position-absolute top-0 start-100 translate-middle badge-cart"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>

              {/* THEME TOGGLE */}
              {/* <Button
                onClick={toggleTheme}
                variant="outline-warning"
                className="rounded-pill d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px" }}
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </Button> */}

            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* SPACER */}
      <div style={{ height: "90px" }} />

      {/* MOBILE MENU */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="end"
        className={`transition-navbar ${
          theme === "dark"
            ? "bg-dark text-light"
            : "bg-light text-dark"
        }`}
      >

        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src="/images/logo.png" alt="InkSpire" width="50px" />
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>

          <Nav className="flex-column gap-3">

            <Nav.Link
              as={NavLink}
              to="/books"
              onClick={() => setShowOffcanvas(false)}
            >
              Books
            </Nav.Link>

            {!isAuthenticated ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  onClick={() => setShowOffcanvas(false)}
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/register"
                  onClick={() => setShowOffcanvas(false)}
                >
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className="d-flex align-items-center gap-2"
                  onClick={() => setShowOffcanvas(false)}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ffc107"
                      }}
                    />
                  ) : (
                    <FaUser />
                  )}

                  {user.name}
                </Nav.Link>

                <Nav.Link
                  onClick={() => {
                    logout();
                    setShowOffcanvas(false);
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            )}

            <Nav.Link
              as={NavLink}
              to="/cart"
              className="position-relative"
              onClick={() => setShowOffcanvas(false)}
            >
              <FaShoppingCart size={18} />

              {cartCount > 0 && (
                <Badge
                  bg="warning"
                  pill
                  className="position-absolute top-0 start-100 translate-middle badge-cart"
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            {/* <Button
              onClick={toggleTheme}
              variant={theme === "dark" ? "light" : "dark"}
              className="rounded-pill mt-3 d-flex align-items-center justify-content-center"
            >
              {theme === "dark"
                ? <FaSun className="me-1" />
                : <FaMoon className="me-1" />}
              {theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </Button> */}

          </Nav>

        </Offcanvas.Body>

      </Offcanvas>
    </>
  );
}