import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPaperPlane,
  FaCheckCircle
} from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";

export default function ContactPage() {

const [submitted,setSubmitted] = useState(false);

const fadeUp={
hidden:{opacity:0,y:40},
show:{opacity:1,y:0,transition:{duration:0.6}}
};

const schema=Yup.object().shape({
name:Yup.string().required("Name required"),
email:Yup.string().email("Invalid email").required("Email required"),
subject:Yup.string().required("Subject required"),
message:Yup.string().min(10,"Message too short").required("Message required")
});

return(

<div className="bg-body text-body">

<style>{`

.hero-img{
height:280px;
width:100%;
object-fit:cover;
border-radius:14px;
}

.glass-card{
border-radius:14px;
border:none;
transition:.3s;
}

.glass-card:hover{
transform:translateY(-6px);
box-shadow:0 20px 35px rgba(0,0,0,0.15);
}

.social-icon{
width:52px;
height:52px;
display:flex;
align-items:center;
justify-content:center;
border-radius:50%;
background:var(--bs-warning);
color:white;
font-size:20px;
margin:0 10px;
transition:.3s;
cursor:pointer;
}

.social-icon:hover{
transform:scale(1.15);
}

.contact-banner{
background-image:url("https://images.unsplash.com/photo-1519681393784-d120267933ba");
background-size:cover;
background-position:center;
border-radius:14px;
overflow:hidden;
}

.overlay{
background:rgba(0,0,0,0.45);
padding:70px 30px;
text-align:center;
color:white;
}

.map-frame{
width:100%;
height:300px;
border:none;
border-radius:14px;
}

.success-box{
text-align:center;
padding:30px;
}

`}</style>

<Container className="py-5">

<motion.div initial="hidden" animate="show" variants={fadeUp}>
<h1 className="fw-bold mb-2">Contact Us</h1>
<p className="text-muted">
We’d love to hear from you. Reach out with questions, feedback, or just to say hello!
</p>
</motion.div>

<Row className="g-4 mt-3">

{/* LEFT SIDE */}

<Col lg={7}>

<motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fadeUp}>

<img
src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
className="hero-img mb-4"
/>

<Row className="g-3">

<Col md={6}>
<Card className="p-4 glass-card shadow-sm bg-body-tertiary">
<div className="d-flex align-items-center">
<FaEnvelope className="text-warning me-3" size={24}/>
<div>
<h6 className="fw-bold mb-1">Email</h6>
<small>support@inkspire.com</small>
</div>
</div>
</Card>
</Col>

<Col md={6}>
<Card className="p-4 glass-card shadow-sm bg-body-tertiary">
<div className="d-flex align-items-center">
<FaPhone className="text-warning me-3" size={24}/>
<div>
<h6 className="fw-bold mb-1">Call Us</h6>
<small>+1 (123) 456-7890</small>
</div>
</div>
</Card>
</Col>

<Col md={12}>
<Card className="p-4 glass-card shadow-sm bg-body-tertiary">
<div className="d-flex align-items-center">
<FaMapMarkerAlt className="text-warning me-3" size={24}/>
<div>
<h6 className="fw-bold mb-1">Visit Us</h6>
<small>123 Bookstore Ln, Readingville</small>
</div>
</div>
</Card>
</Col>

</Row>

</motion.div>

</Col>

{/* FORM */}

<Col lg={5}>

<motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={fadeUp}>

<Card className="p-4 shadow-sm glass-card bg-body-tertiary">

<h4 className="fw-bold mb-3">Send Us a Message</h4>

{submitted ? (

<div className="success-box">

<motion.div
initial={{scale:0}}
animate={{scale:1}}
transition={{duration:0.4}}
>

<FaCheckCircle size={60} className="text-success mb-3"/>

<h5 className="fw-bold">Message Sent!</h5>

<p className="text-muted">
Thanks for contacting us. We'll get back to you soon.
</p>

</motion.div>

</div>

):( 

<Formik

initialValues={{name:"",email:"",subject:"",message:""}}
validationSchema={schema}

onSubmit={async(values,{resetForm,setSubmitting})=>{

await fetch("https://formspree.io/f/myknwkgk",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(values)
});

setSubmitting(false);
setSubmitted(true);
resetForm();

}}

>

{({handleSubmit,handleChange,values,errors,touched,isSubmitting})=>(

<Form noValidate onSubmit={handleSubmit}>

<Form.Group className="mb-3">
<Form.Label>Your Name</Form.Label>
<Form.Control
name="name"
value={values.name}
onChange={handleChange}
isInvalid={touched.name && errors.name}
/>
<Form.Control.Feedback type="invalid">
{errors.name}
</Form.Control.Feedback>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Your Email</Form.Label>
<Form.Control
type="email"
name="email"
value={values.email}
onChange={handleChange}
isInvalid={touched.email && errors.email}
/>
<Form.Control.Feedback type="invalid">
{errors.email}
</Form.Control.Feedback>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Subject</Form.Label>
<Form.Control
name="subject"
value={values.subject}
onChange={handleChange}
isInvalid={touched.subject && errors.subject}
/>
<Form.Control.Feedback type="invalid">
{errors.subject}
</Form.Control.Feedback>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Your Message</Form.Label>
<Form.Control
as="textarea"
rows={4}
name="message"
value={values.message}
onChange={handleChange}
isInvalid={touched.message && errors.message}
/>
<Form.Control.Feedback type="invalid">
{errors.message}
</Form.Control.Feedback>
</Form.Group>

<Button
variant="warning"
type="submit"
className="w-100 fw-bold"
disabled={isSubmitting}
>

{isSubmitting ? (
<>
<Spinner animation="border" size="sm" className="me-2"/>
Sending...
</>
):(
<>
<FaPaperPlane className="me-2"/> Send Message
</>
)}

</Button>

</Form>

)}

</Formik>

)}

</Card>

</motion.div>

</Col>

</Row>

{/* GOOGLE MAP */}

<motion.div
initial="hidden"
whileInView="show"
viewport={{once:true}}
variants={fadeUp}
className="mt-5"
>

<iframe
className="map-frame"
src="https://maps.google.com/maps?q=bookstore&t=&z=13&ie=UTF8&iwloc=&output=embed"
/>

</motion.div>

{/* SOCIAL */}

<motion.div
initial="hidden"
whileInView="show"
viewport={{once:true}}
variants={fadeUp}
className="mt-5"
>

<Card className="p-5 text-center glass-card bg-body-tertiary">

<h3 className="fw-bold mb-2">Connect With Us</h3>

<p className="text-muted mb-4">
Follow us for book updates and recommendations.
</p>

<div className="d-flex justify-content-center">

<div className="social-icon"><FaFacebook/></div>
<div className="social-icon"><FaTwitter/></div>
<div className="social-icon"><FaInstagram/></div>
<div className="social-icon"><FaEnvelope/></div>

</div>

</Card>

</motion.div>

{/* CTA */}

<motion.div
initial="hidden"
whileInView="show"
viewport={{once:true}}
variants={fadeUp}
className="mt-5"
>

<div className="contact-banner">

<div className="overlay">

<h2 className="fw-bold mb-3">Contact Us</h2>

<p className="mb-4">
Reach out with any questions, feedback, or just to say hello.
</p>

<Button variant="warning" size="lg">
<FaPaperPlane className="me-2"/> Send Message
</Button>

</div>

</div>

</motion.div>

</Container>

</div>
);
}