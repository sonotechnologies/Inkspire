import { useState, useMemo, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  FaBook,
  FaStar,
  FaUserGraduate,
  FaBusinessTime,
  FaHeart,
  FaShoppingCart,
  FaArrowRight,
} from "react-icons/fa";
import { MdChildCare, MdLibraryBooks } from "react-icons/md";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function BooksPage() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [booksData, setBooksData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Books");
  const [sortOption, setSortOption] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 9;

  useEffect(() => {
    axios
      .get("https://inkspire-api-9xkt.onrender.com/books")
      .then((res) => {
        setBooksData(res.data);
        setCurrentPage(1); // reset pagination when books load
      })
      .catch((err) => console.error(err));
  }, []);

  const categories = [
    { name: "All Books", icon: <FaBook /> },
    { name: "Fiction", icon: <FaBook /> },
    { name: "Science Fiction", icon: <FaStar /> },
    { name: "Fantasy", icon: <FaHeart /> },
    { name: "Romance", icon: <FaUserGraduate /> },
    { name: "Mystery", icon: <MdLibraryBooks /> },
    { name: "Self Develop", icon: <FaUserGraduate /> },
    { name: "Business", icon: <FaBusinessTime /> },
    { name: "Biography", icon: <MdLibraryBooks /> },
    { name: "Young Adult", icon: <MdChildCare /> },
    { name: "Children", icon: <MdChildCare /> },
  ];

  const filteredBooks = useMemo(() => {
    let filtered = [...booksData]; // clone array so we don't mutate state

    if (selectedCategory !== "All Books") {
      filtered = filtered.filter((b) => b.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sortOption === "rating") filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [booksData, selectedCategory, searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handleAddToCart = (book) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart.", {
        position: "top-center",
      });
      return;
    }

    addToCart(book);
    toast.success("Book added to cart 📚", { position: "top-center" });
  };

  const cardBg = theme === "dark" ? "bg-dark text-light" : "bg-white text-dark";
  const sidebarBg =
    theme === "dark" ? "bg-secondary text-light" : "bg-light text-dark";

  return (
    <Container
      fluid
      className={`py-5 ${theme === "dark" ? "bg-dark" : "bg-light"}`}
    >
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />

      <Row>
        {/* Sidebar */}
        <Col md={2} className="mb-4">
          <h5 className="mb-3">Categories</h5>

          <div className={`list-group ${sidebarBg} p-2 rounded`}>
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? "warning" : "light"}
                className="d-flex align-items-center justify-content-start mb-2 border-0"
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setCurrentPage(1);
                }}
              >
                <span className="me-2">{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10}>
          {/* Search & Sort */}
          <Row className="mb-4 align-items-center">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>
            </Col>

            <Col md={6} className="text-md-end mt-2 mt-md-0">
              <Form.Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ width: "220px", display: "inline-block" }}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Books */}
          <Row className="g-4">
            {paginatedBooks.map((book) => (
              <Col md={4} sm={6} xs={12} key={book.id}>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card
                    className={`${cardBg} shadow-sm`}
                    style={{
                      height: "470px",
                      borderRadius: "16px",
                      overflow: "hidden",
                    }}
                  >
                    {book.isFeatured && (
                      <Badge
                        bg="warning"
                        text="dark"
                        style={{ position: "absolute", top: 10, left: 10 }}
                      >
                        Bestseller
                      </Badge>
                    )}

                    <Card.Img
                      variant="top"
                      src={book.image}
                      style={{ height: "220px", objectFit: "cover" }}
                    />

                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={{ fontSize: "1rem" }}>
                        {book.title}
                      </Card.Title>

                      <Card.Text className="text-muted mb-1">
                        {book.author}
                      </Card.Text>

                      <div className="mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <FaStar
                            key={idx}
                            color={
                              idx < Math.floor(book.rating)
                                ? "#ffcc33"
                                : "#e0e0e0"
                            }
                          />
                        ))}
                      </div>

                      <Card.Text className="fw-bold mb-2">
                        ${book.price}
                      </Card.Text>

                      <div className="mt-auto d-flex gap-2">
                        <Button
                          style={{
                            background:
                              "linear-gradient(45deg,#ffb347,#ffcc33)",
                            border: "none",
                            flex: 1,
                          }}
                          onClick={() => handleAddToCart(book)}
                        >
                          <FaShoppingCart className="me-2" />
                          Add to Cart
                        </Button>

                        <Button
                          as={Link}
                          to={`/books/${book.id}`}
                          variant={
                            theme === "dark"
                              ? "secondary"
                              : "outline-dark"
                          }
                          style={{ flex: 1 }}
                          onClick={() => navigate(`/books/${book.id}`)}
                        >
                          View <FaArrowRight className="ms-1" />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <Row className="mt-4">
            <Col className="d-flex justify-content-center gap-2 flex-wrap">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                style={{background:
                              "linear-gradient(40deg,#ffb347,#ffcc33)", border:"none"}}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentPage === idx + 1 ? "warning" : "light"}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}

              <Button
                disabled={currentPage === totalPages}
                style={{background:
                              "linear-gradient(45deg,#ffb347,#ffcc33)", border:"none"}}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}