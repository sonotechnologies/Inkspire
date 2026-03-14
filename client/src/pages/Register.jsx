import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Toast, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Register() {

  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  /*
  =========================
  PAGE LOAD SKELETON
  =========================
  */

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /*
  =========================
  REGISTER USER
  =========================
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {

      setRegistering(true);

      const success = await register(name, email, password);

      if (!success) {
        setRegistering(false);
        setError("Email already exists. Try logging in instead.");
        return;
      }

      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      navigate("/books");

    } catch (err) {

      console.error(err);
      setRegistering(false);
      setError("Registration failed. Please try again.");

    }
  };

  return (
    <Container className="my-5">

      <Row className="justify-content-center">

        <Col xs={12} sm={10} md={6} lg={5}>

          <h2 className="mb-4 text-center theme-transition">
            Create an Account
          </h2>

          {/* Error Toast */}

          {error && (
            <Toast
              onClose={() => setError("")}
              show={!!error}
              delay={4000}
              autohide
              className="position-fixed top-0 start-50 translate-middle-x mt-3 zindex-tooltip"
            >
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body>{error}</Toast.Body>
            </Toast>
          )}

          {/* Skeleton Loader */}

          {loading ? (

            <div className="p-4">
              <Skeleton height={30} className="mb-3" />
              <Skeleton height={30} className="mb-3" />
              <Skeleton height={30} className="mb-3" />
              <Skeleton height={45} />
            </div>

          ) : registering ? (

            <div className="d-flex justify-content-center align-items-center p-5">

              <Spinner animation="border" role="status" variant="warning">
                <span className="visually-hidden">Registering...</span>
              </Spinner>

            </div>

          ) : (

            <Form
              className="theme-transition p-4 rounded shadow-sm bg-light"
              onSubmit={handleSubmit}
            >

              <Form.Group className="mb-3" controlId="formName">
                <Form.Label className="text-dark">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="text-dark">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className="text-dark">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                className="w-100 py-2 fw-bold"
              >
                Register
              </Button>

              <div className="mt-3 text-center text-dark">
                Already have an account? <Link to="/login">Login</Link>
              </div>

            </Form>

          )}

        </Col>

      </Row>

    </Container>
  );
}