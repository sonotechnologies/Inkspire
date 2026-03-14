import { Container, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { Formik } from "formik";
import * as Yup from "yup";

import { toast } from "react-toastify";

export default function CheckoutPage() {

  const navigate = useNavigate();
  const { clearCart } = useCart();

  const checkoutSchema = Yup.object({

    fullName: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Full name is required"),

    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),

    city: Yup.string()
      .min(2, "City name too short")
      .required("City is required"),

    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone must contain only numbers")
      .min(10, "Phone number too short")
      .max(15, "Phone number too long")
      .required("Phone number is required"),

    note: Yup.string().max(200)

  });

  return (

    <Container style={{ maxWidth: "600px" }} className="py-5">

      <h2 className="mb-4 fw-bold">Shipping Details</h2>

      <Formik

        initialValues={{
          fullName: "",
          address: "",
          city: "",
          phone: "",
          note: ""
        }}

        validationSchema={checkoutSchema}

        onSubmit={async (values, { setSubmitting, resetForm }) => {

          try {

            await api.post("/orders/create", values);

            toast.success("Order placed successfully 🎉");

            resetForm();

            clearCart(); // clear frontend cart

            setTimeout(() => {
              navigate("/books");
            }, 1200);

          } catch (error) {

            console.error(error);

            toast.error(
              error?.response?.data?.error || "Order failed"
            );

          } finally {

            setSubmitting(false);

          }

        }}

      >

      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting
      }) => (

        <Form noValidate onSubmit={handleSubmit}>

          <Form.Group className="mb-3">

            <Form.Label>Full Name</Form.Label>

            <Form.Control
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.fullName && errors.fullName}
            />

            <Form.Control.Feedback type="invalid">
              {errors.fullName}
            </Form.Control.Feedback>

          </Form.Group>


          <Form.Group className="mb-3">

            <Form.Label>Address</Form.Label>

            <Form.Control
              type="text"
              name="address"
              placeholder="Street address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.address && errors.address}
            />

            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>

          </Form.Group>


          <Form.Group className="mb-3">

            <Form.Label>City</Form.Label>

            <Form.Control
              type="text"
              name="city"
              placeholder="Enter your city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.city && errors.city}
            />

            <Form.Control.Feedback type="invalid">
              {errors.city}
            </Form.Control.Feedback>

          </Form.Group>


          <Form.Group className="mb-3">

            <Form.Label>Phone</Form.Label>

            <Form.Control
              type="tel"
              name="phone"
              placeholder="08012345678"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={touched.phone && errors.phone}
            />

            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>

          </Form.Group>


          <Form.Group className="mb-4">

            <Form.Label>Order Note (Optional)</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              name="note"
              placeholder="Extra delivery instructions"
              value={values.note}
              onChange={handleChange}
              onBlur={handleBlur}
            />

          </Form.Group>


          <Button
            type="submit"
            variant="warning"
            className="w-100"
            disabled={isSubmitting}
          >

            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}

          </Button>

        </Form>

      )}

      </Formik>

    </Container>

  );

}