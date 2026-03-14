import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InkspireNavbar from "./components/layout/Navbar";
import BooksPage from "./pages/Books";
import CartPage from "./pages/Cart";
// import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/Checkout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookDetails from "./pages/BookDetails";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import ProfilePage from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <InkspireNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute> } />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage/> }/>
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {/* <Footer /> */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;