import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App(): JSX.Element {
  return (
    <div className="App box-border">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home><Login /></Home>} />
          <Route path="/register" element={<Home><Register /></Home>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}
export default App;
