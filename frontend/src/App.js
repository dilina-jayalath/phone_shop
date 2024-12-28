import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";

import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import PageNotFound from "./pages/pageNotFount";
import Home from "./pages/Home/Home";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Footer from "./components/home/Footer/Footer";
import SpecialCase from "./components/SpecialCase/SpecialCase";

const Layout = () => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer/>
      <FooterBottom/>
    </div>
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}> 
        <Route index element={<Home />}></Route>
        <Route path="*" element={<PageNotFound />} />
    </Route>
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
