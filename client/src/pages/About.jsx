import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaBullseye,
  FaUsers,
  FaCheckCircle,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from "react-icons/fa";

export default function AboutPage() {

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  /* COUNTER ANIMATION */

  const Counter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [target]);

    return <h3 className="fw-bold text-warning">{count}+</h3>;
  };

  return (
    <div className="about-page text-body bg-body">

      <style>
        {`

        /* HERO */

        .hero-section{
          height:340px;
          background-image:url("https://images.unsplash.com/photo-1512820790803-83ca734da794");
          background-size:cover;
          background-position:center;
          background-attachment:fixed;
          border-radius:14px;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          text-align:center;
          position:relative;
        }

        .hero-overlay{
          position:absolute;
          inset:0;
          background:rgba(0,0,0,0.45);
          border-radius:14px;
        }

        .hero-content{
          position:relative;
          z-index:2;
        }

        /* GLASS CARD */

        .glass-card{
          backdrop-filter: blur(10px);
          background: rgba(255,255,255,0.05);
          border-radius:14px;
          border:1px solid rgba(255,255,255,0.15);
          transition: all .3s ease;
        }

        .glass-card:hover{
          transform:translateY(-6px);
          box-shadow:0 15px 30px rgba(0,0,0,0.15);
        }

        /* TEAM */

        .team-img{
          height:220px;
          width:100%;
          object-fit:cover;
          border-radius:12px;
        }

        .team-icons{
          opacity:0;
          transition:.3s;
        }

        .team-card:hover .team-icons{
          opacity:1;
        }

        .team-icons svg{
          margin:0 6px;
          cursor:pointer;
          color:#f4b400;
        }

        .stat-card{
          text-align:center;
          padding:25px;
        }

        `}
      </style>

      <Container className="py-5">

        {/* HERO */}

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="hero-section mb-5"
        >

          <div className="hero-overlay"></div>

          <div className="hero-content">
            <h1 className="fw-bold">About InkSpire</h1>
            <p>Where stories spark imagination</p>
          </div>

        </motion.div>

        {/* STORY */}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
        >

          <Card className="glass-card p-4 mb-5 bg-body-tertiary">

            <Row className="align-items-center g-4">

              <Col md={6}>
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                  className="img-fluid rounded"
                />
              </Col>

              <Col md={6}>
                <h3 className="fw-bold mb-3">Our Story</h3>

                <p className="text-muted">
                  InkSpire was founded with a passion for literature and a
                  mission to connect readers with stories that inspire,
                  educate, and entertain.
                </p>

                <p className="text-muted">
                  From timeless classics to modern masterpieces, our
                  bookstore exists to help readers discover worlds hidden
                  within pages.
                </p>

              </Col>

            </Row>

          </Card>

        </motion.div>

        {/* STATS */}

        <Row className="g-4 mb-5">

          <Col md={4}>
            <Card className="glass-card stat-card bg-body-tertiary">
              <Counter target={12000}/>
              <p className="text-muted">Books Available</p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="glass-card stat-card bg-body-tertiary">
              <Counter target={8500}/>
              <p className="text-muted">Happy Readers</p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="glass-card stat-card bg-body-tertiary">
              <Counter target={120}/>
              <p className="text-muted">Authors Featured</p>
            </Card>
          </Col>

        </Row>

        {/* MISSION + WHY */}

        <Row className="g-4 mb-5">

          <Col md={6}>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once:true }}
              variants={fadeUp}
            >

              <h3 className="fw-bold mb-3">Our Mission</h3>

              <Card className="glass-card p-4 bg-body-tertiary">

                <div className="d-flex align-items-center mb-3">
                  <FaBullseye className="text-warning me-2"/>
                  <h5 className="mb-0">Our Mission</h5>
                </div>

                <p className="text-muted mb-0">
                  To foster a love for reading by offering a carefully
                  curated collection of books and an exceptional shopping
                  experience.
                </p>

              </Card>

            </motion.div>

          </Col>

          <Col md={6}>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once:true }}
              variants={fadeUp}
            >

              <h3 className="fw-bold mb-3">Why Choose Us</h3>

              <ul className="list-unstyled text-muted">

                <li className="mb-2">
                  <FaCheckCircle className="text-warning me-2"/>
                  Handpicked book selections
                </li>

                <li className="mb-2">
                  <FaCheckCircle className="text-warning me-2"/>
                  Exceptional customer service
                </li>

                <li>
                  <FaCheckCircle className="text-warning me-2"/>
                  Passionate reading community
                </li>

              </ul>

            </motion.div>

          </Col>

        </Row>

        {/* TEAM */}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once:true }}
          variants={fadeUp}
        >

          <h3 className="fw-bold text-center mb-4">
            Meet Our Team
          </h3>

          <Row className="g-4">

            {[
              {
                name:"Martin Williams",
                role:"Founder & CEO",
                img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
              },
              {
                name:"Ava Johnson",
                role:"Editorial Director",
                img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              },
              {
                name:"Daniel Brown",
                role:"Community Manager",
                img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
              }
            ].map((member,i)=>(
              <Col md={4} key={i}>

                <Card className="glass-card team-card text-center p-3 bg-body-tertiary">

                  <img src={member.img} className="team-img"/>

                  <Card.Body>

                    <h5 className="fw-bold">{member.name}</h5>
                    <p className="text-muted">{member.role}</p>

                    <div className="team-icons">
                      <FaTwitter/>
                      <FaLinkedin/>
                      <FaInstagram/>
                    </div>

                  </Card.Body>

                </Card>

              </Col>
            ))}

          </Row>

        </motion.div>

        {/* CTA */}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once:true }}
          variants={fadeUp}
        >

          <Card className="glass-card text-center p-5 mt-5 bg-body-tertiary">

            <h3 className="fw-bold mb-3">
              Join Our Reading Community
            </h3>

            <p className="text-muted mb-4">
              Discover stories, meet readers, and explore the world of books.
            </p>

            <Button variant="warning" size="lg">
              Explore Books
            </Button>

          </Card>

        </motion.div>

      </Container>
    </div>
  );
}