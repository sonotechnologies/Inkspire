import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (book) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart.", {
        position: "top-center",
      });
      return;
    }

    addToCart(book);

    toast.success("Book added to cart 📚", {
      position: "top-center",
    });
  };

  const featuredBooks = [
    {
      id: 1,
      title: "The Enchanted Forest",
      author: "Alice Green",
      price: 1299,
      img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    },
    {
      id: 2,
      title: "Galactic Odyssey",
      author: "Mark Stellar",
      price: 1550,
      img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    },
    {
      id: 3,
      title: "The Lost City",
      author: "Liam Drake",
      price: 1099,
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    },
    {
      id: 4,
      title: "History of Time",
      author: "Stephen Chronicle",
      price: 1450,
      img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    },
    {
      id: 5,
      title: "Shadow Kingdom",
      author: "R. K. Vale",
      price: 1320,
      img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    },
    {
      id: 6,
      title: "Digital Dreams",
      author: "Nova Hart",
      price: 1400,
      img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    },
  ];

  const bgClass = "bg-light text-dark";

  const cardClass ="bg-white text-dark border-0";

  const buttonStyle = {
    background: "linear-gradient(45deg,#ffb347,#ffcc33)",
    border: "none",
    fontWeight: "600",
  };

  return (
    <Container fluid className={`py-5 ${bgClass}`}>

      <ToastContainer theme={"light"} />

      {loading ? (
        <>
          <Skeleton height={420} className="mb-4" />
          <Skeleton height={60} count={2} />
        </>
      ) : (
        <>

{/* HERO */}

<Row className="align-items-center mb-5">
  <Col md={6}>
    <h1 className="display-3 fw-bold mb-3">
      Where Stories Come Alive
    </h1>

    <p className="lead opacity-75">
      Explore thousands of books curated for passionate readers.
    </p>

    <Button size="lg" style={buttonStyle} className="px-4 shadow">
      Explore Books
    </Button>
  </Col>

  <Col md={6}>
    <img
      src="https://images.unsplash.com/photo-1528207776546-365bb710ee93"
      className="img-fluid rounded shadow-lg"
    />
  </Col>
</Row>


{/* TRUST METRICS */}

<Row className="text-center mb-5 g-4">
  <Col md={4}>
    <h2 className="fw-bold">50K+</h2>
    <p className="opacity-75">Readers</p>
  </Col>

  <Col md={4}>
    <h2 className="fw-bold">10K+</h2>
    <p className="opacity-75">Books Available</p>
  </Col>

  <Col md={4}>
    <h2 className="fw-bold">4.9 ★</h2>
    <p className="opacity-75">Average Rating</p>
  </Col>
</Row>


{/* FEATURED BOOKS */}

<h2 className="fw-bold mb-4 text-center">Featured Books</h2>

<Swiper
  modules={[Navigation, Autoplay, EffectCoverflow]}
  effect="coverflow"
  centeredSlides
  grabCursor
  loop
  slidesPerView={3}
  spaceBetween={40}
  navigation
  autoplay={{
    delay: 2200,
    disableOnInteraction: false,
  }}
  coverflowEffect={{
    rotate: 0,
    stretch: 0,
    depth: 180,
    modifier: 2,
    slideShadows: false,
  }}
  breakpoints={{
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1200: { slidesPerView: 3 },
  }}
>

  {featuredBooks.map((book) => (
    <SwiperSlide key={book.id}>
      <Card
        className={cardClass}
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          transform: "scale(.92)",
          transition: "all .45s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.02)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(.92)")
        }
      >
        <Card.Img
          src={book.img}
          style={{
            height: "330px",
            objectFit: "cover",
          }}
        />

        <Card.Body>
          <Card.Title>{book.title}</Card.Title>

          <Card.Text className="opacity-75">
            {book.author}
          </Card.Text>

          <Card.Text className="fw-bold">
            ${(book.price / 100).toFixed(2)}
          </Card.Text>

          <Button
            style={buttonStyle}
            className="w-100"
            onClick={() => handleAddToCart(book)}
          >
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    </SwiperSlide>
  ))}
</Swiper>


{/* SECTION DIVIDER GLOW */}

<div
  style={{
    height: "120px",
    background:
      "radial-gradient(circle at center, rgba(255,180,60,.25), transparent 70%)",
  }}
/>


{/* WHY INKSPIRE */}

<Row className="align-items-center p-5 rounded shadow">
  <Col md={6}>
    <h2 className="fw-bold mb-3">Why Inkspire?</h2>

    <p className="opacity-75">
      Discover books you didn't know you needed.
      Inkspire blends powerful discovery with a beautiful
      reading marketplace.
    </p>

    <Button style={buttonStyle}>Learn More</Button>
  </Col>

  <Col md={6}>
    <img
      src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d"
      className="img-fluid rounded shadow"
    />
  </Col>
</Row>


{/* NEWSLETTER */}

<Row className="justify-content-center mt-5">
  <Col md={7}>
    <Card
      className="border-0 text-center p-5"
      style={{
        backdropFilter: "blur(20px)",
        borderRadius: "22px",
        background:
             "rgba(255,255,255,0.85)",
        boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
      }}
    >
      <h3 className={`fw-bold mb-3 `}>
        Join the Inkspire Community
      </h3>

      <p className={`text-muted`}>
        Exclusive book drops and curated reading lists.
      </p>

      <Form className="d-flex mt-4">
        <Form.Control
          type="email"
          placeholder="Enter your email"
          className="me-3"
          style={{
            borderRadius: "10px",
            background: "#fff",
            color:"#000",
            border: "none",
          }}
        />

        <Button
          style={{
            ...buttonStyle,
            boxShadow: "0 0 18px rgba(255,200,0,.6)",
          }}
        >
          Subscribe
        </Button>
      </Form>
    </Card>
  </Col>
</Row>

        </>
      )}
    </Container>
  );
}