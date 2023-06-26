import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";

function App(): JSX.Element {
  return (
    <div className="App box-border">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home><Login /></Home>} />
          <Route path="/register" element={<Login />} />
          <Route path="/logout" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}
export default App;
