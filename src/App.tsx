import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv></Tv>}></Route>
        <Route path="/search" element={<Search></Search>}></Route>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/movies/:id" element={<Home></Home>}></Route>
        <Route path="/tv/:id" element={<Tv></Tv>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
