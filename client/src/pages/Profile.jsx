import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import { api } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(null);

  /*
  =========================
  LOAD PROFILE
  =========================
  */

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile");

      setUser(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  /*
  =========================
  LOAD ORDERS
  =========================
  */

  const loadOrders = async () => {
    try {
      const res = await api.get("/profile/orders");

      setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  /*
  =========================
  DELETE ACCOUNT
  =========================
  */

  const deleteAccount = async () => {
    if (!window.confirm("Delete account permanently?")) return;

    try {
      await api.delete("/profile/delete");

      toast.success("Account deleted");

      logout();

      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
    }
  };

  /*
  =========================
  AVATAR UPLOAD
  =========================
  */

  const uploadAvatar = async (file) => {
    const formData = new FormData();

    formData.append("avatar", file);

    try {
      await api.post("/profile/avatar", formData);

      toast.success("Avatar updated");

      loadProfile();
    } catch {
      toast.error("Upload failed");
    }
  };

  if (!user) return null;

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* PROFILE CARD */}

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4">
            <div className="text-center mb-4">
              <img
                src={
                  avatarPreview ||
                  (user.avatar
                    ? `http://localhost:5000${user.avatar}`
                    : "https://images.unsplash.com/photo-1527980965255-d3b416303d12")
                }
                alt="avatar"
                className="rounded-circle"
                style={{
                  width: 110,
                  height: 110,
                  objectFit: "cover",
                }}
              />

              <Form.Group className="mt-3">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    setAvatarPreview(URL.createObjectURL(file));

                    uploadAvatar(file);
                  }}
                />
              </Form.Group>
            </div>

            <h5 className="mb-3 text-center">Profile Info</h5>

            {editing ? (
              <Formik
                initialValues={{
                  name: user.name,
                  email: user.email,
                }}
                validationSchema={Yup.object({
                  name: Yup.string().required("Required"),

                  email: Yup.string()
                    .email("Invalid email")
                    .required("Required"),
                })}
                onSubmit={async (values) => {
                  try {
                    await api.put("/profile/update", values);

                    toast.success("Profile updated");

                    setEditing(false);

                    loadProfile();
                  } catch {
                    toast.error("Update failed");
                  }
                }}
              >
                {({ handleSubmit, handleChange, values, errors, touched }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>

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
                      <Form.Label>Email</Form.Label>

                      <Form.Control
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={touched.email && errors.email}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" className="w-100 mb-2">
                      Save
                    </Button>

                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Form>
                )}
              </Formik>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>

                <p>
                  <strong>Email:</strong> {user.email}
                </p>

                <Button
                  className="w-100 mb-2"
                  variant="outline-dark"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>

                <Button
                  className="w-100 mb-2"
                  variant="outline-primary"
                  onClick={() => setShowPassword(true)}
                >
                  Change Password
                </Button>

                <Button
                  className="w-100"
                  variant="outline-danger"
                  onClick={deleteAccount}
                >
                  Delete Account
                </Button>
              </>
            )}
          </Card>
        </Col>

        {/* ORDER HISTORY */}

        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4">
            <h5 className="mb-4">Transaction History</h5>

            <Table responsive hover>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>

                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                    <td>{order.items.length}</td>

                    <td>
                      <Button size="sm" onClick={() => setSelectedOrder(order)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* ORDER DETAILS MODAL */}

      <Modal
        show={!!selectedOrder}
        onHide={() => setSelectedOrder(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedOrder?.items.map((item) => (
            <div key={item.id} className="mb-3">
              <strong>{item.book.title}</strong>

              <div>Quantity: {item.quantity}</div>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      {/* PASSWORD MODAL */}

      <Modal show={showPassword} onHide={() => setShowPassword(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
            }}
            validationSchema={Yup.object({
              currentPassword: Yup.string().required("Required"),

              newPassword: Yup.string().min(6).required("Required"),
            })}
            onSubmit={async (values) => {
              try {
                await api.put("/profile/password", values);

                toast.success("Password updated");

                setShowPassword(false);
              } catch {
                toast.error("Password change failed");
              }
            }}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>

                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    isInvalid={
                      touched.currentPassword && errors.currentPassword
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>

                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    isInvalid={touched.newPassword && errors.newPassword}
                  />
                </Form.Group>

                <Button type="submit" className="w-100">
                  Update Password
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
