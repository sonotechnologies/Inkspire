import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Toast, Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /*
  =========================
  PAGE SKELETON
  =========================
  */

  useEffect(() => {

    const timer = setTimeout(() => setLoading(false), 800);

    return () => clearTimeout(timer);

  }, []);

  /*
  =========================
  LOGIN USER
  =========================
  */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      setSubmitting(true);

      const success = await login(email, password);

      if (!success) {

        setSubmitting(false);

        setError("Invalid credentials or user not registered.");

        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      navigate("/books");

    } catch (err) {

      console.error(err);

      setSubmitting(false);

      setError("Login failed. Please try again.");

    }

  };

  return (
    <Container className="my-5">

      <Row className="justify-content-center">

        <Col xs={12} sm={10} md={6} lg={5}>

          <h2 className="mb-4 text-center theme-transition">
            Login to Inkspire
          </h2>

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

          {loading ? (

            <div className="p-4">
              <Skeleton height={30} className="mb-3" />
              <Skeleton height={30} className="mb-3" />
              <Skeleton height={45} />
            </div>

          ) : (

            <Form
              className="theme-transition p-4 rounded shadow-sm bg-light"
              onSubmit={handleSubmit}
            >

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="text-dark">Email</Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    color: "inherit",
                    backgroundColor: "inherit",
                    borderColor: "rgba(0,0,0,0.2)"
                  }}
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
                  style={{
                    color: "inherit",
                    backgroundColor: "inherit",
                    borderColor: "rgba(0,0,0,0.2)"
                  }}
                />

              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                className="w-100 py-2 fw-bold"
                disabled={submitting}
              >

                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}

              </Button>

              <div className="mt-3 text-center text-dark">
                Don't have an account? <Link to="/register">Register</Link>
              </div>

            </Form>

          )}

        </Col>

      </Row>

    </Container>
  );
}