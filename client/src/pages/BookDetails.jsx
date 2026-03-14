import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Badge, Card } from "react-bootstrap";
import { api } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";

export default function BookDetails() {

  const { id } = useParams();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchBook = async () => {

      try {

        const res = await api.get(`/books/${id}`);
        setBook(res.data);

        const rec = await api.get("/books");

        const filtered = rec.data
          .filter(b => b.id !== res.data.id)
          .slice(0, 4);

        setRecommended(filtered);

      } catch (error) {

        console.error(error);
        toast.error("Failed to load book");

      } finally {

        setLoading(false);

      }

    };

    fetchBook();

  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-5 text-center">
        <h3>Book not found</h3>
      </Container>
    );
  }

  return (

    <Container className="py-5">

      {/* MAIN DETAILS CARD */}

      <Card
        className="border-0 shadow-lg p-4"
        style={{ borderRadius: "14px" }}
      >

        <Row className="align-items-center g-5">

          {/* BOOK IMAGE */}

          <Col md={5} className="text-center">

            <div
              className="shadow"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                display: "inline-block",
                background: "#f8f9fa"
              }}
            >

              <img
                src={book.image}
                alt={book.title}
                style={{
                  maxHeight: "460px",
                  width: "100%",
                  objectFit: "cover"
                }}
              />

            </div>

          </Col>


          {/* BOOK INFO */}

          <Col md={7}>

            <Badge
              bg="secondary"
              className="mb-3 px-3 py-2"
              style={{ fontSize: "0.75rem" }}
            >
              {book.category || "Book"}
            </Badge>

            <h2 className="fw-bold mb-2">
              {book.title}
            </h2>

            <p className="text-muted mb-3 fs-6">
              by {book.author}
            </p>

            <h3
              className="fw-bold mb-4"
              style={{ color: "#f59e0b" }}
            >
              ${book.price}
            </h3>

            <p className="text-muted mb-4" style={{ maxWidth: "520px" }}>
              {book.description ||
                "A gripping thriller about a mysterious world filled with secrets waiting to be uncovered."}
            </p>

            <Button
              variant="warning"
              size="lg"
              className="px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
              style={{ width: "fit-content" }}
              onClick={() => {
                addToCart(book);
                toast.success("Added to cart");
              }}
            >
              <FaShoppingCart />
              Add To Cart
            </Button>

          </Col>

        </Row>


        {/* RECOMMENDED */}

        <hr className="my-5" />

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="fw-bold mb-0">
            Recommended Books
          </h4>

        </div>


        <Row className="g-4">

          {recommended.map((item) => (

            <Col key={item.id} xs={6} md={3}>

              <Card
                className="border-0 shadow-sm h-100 text-center"
                style={{
                  borderRadius: "10px",
                  transition: "all 0.25s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0,0,0,0.08)";
                }}
              >

                <Card.Img
                  variant="top"
                  src={item.image}
                  style={{
                    height: "210px",
                    objectFit: "cover",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px"
                  }}
                />

                <Card.Body>

                  <Card.Title
                    style={{
                      fontSize: "0.95rem",
                      minHeight: "45px"
                    }}
                  >
                    {item.title}
                  </Card.Title>

                  <p
                    className="fw-bold mb-0"
                    style={{ color: "#f59e0b" }}
                  >
                    ${item.price}
                  </p>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

      </Card>

    </Container>

  );

}