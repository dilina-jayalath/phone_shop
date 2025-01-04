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
import FooterBottom from "./components/home/Footer/FooterBottom";
import Footer from "./components/home/Footer/Footer";
import SpecialCase from "./components/SpecialCase/SpecialCase";

import Home from "./pages/Home/Home";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import Repair from "./pages/Repair/Rapair";
import RepairTableAdmin from "./pages/admin/RapairTable";

import RepairForm from "./pages/Repair/repairForm";
import Phones from "./pages/Phones/Phones";
import Watchs from "./pages/SmartWatchs/smartWatchs";
import Tablets from "./pages/Tablets/Tablets";
import Accessoris from "./pages/Accessories/Accessories";
import About from "./pages/About/About";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Admin from "./pages/admin/Admin";
import Welcome from "./pages/admin/Welcome";
import OrdersTable from "./pages/admin/OrderTable";
import ProductTable from "./pages/admin/ProductTable";


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
        <Route path="/signin" element={<SignIn/>}></Route>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/orders" element={<Order />}></Route>
        <Route path="/repair" element={<Repair />}></Route>
        <Route path="/repair/form" element={<RepairForm />}></Route>
        <Route path="/phones" element={<Phones />}></Route>
        <Route path="/watchs" element={<Watchs />}></Route>
        <Route path="/tablets" element={<Tablets />}></Route>
        <Route path="/accessories" element={<Accessoris />}></Route>
        <Route path ="/about" element={<About/>}></Route>
        <Route path="/product/:id" element={<ProductDetails />}></Route>
        <Route path="/admin" element={<Admin />}>
        <Route index element={<Welcome />}></Route>
          <Route path="/admin/repairs" element={<RepairTableAdmin />} className="z-20"></Route>
          <Route path="/admin/products" element={<ProductTable />} className="z-20"></Route>
          <Route path="/admin/orders" element={<OrdersTable />} className="z-20"></Route>
        </Route>

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
