import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import {CitiesProvider} from "./context/citiesContext";
import {AuthProvider} from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />}></Route>
            <Route path='product' element={<Product />}></Route>
            <Route path='pricing' element={<Pricing />}></Route>
            <Route path='login' element={<Login />}></Route>
            <Route path='app' element={<AppLayout />}>
              <Route index element={<Navigate replace to='cities' />}></Route>

              <Route path='cities' element={<CityList />}></Route>

              <Route path='cities/:id' element={<City />}></Route>
              <Route path='countries' element={<CountryList />}></Route>
              <Route path='form' element={<Form />}></Route>
            </Route>
            <Route path='*' element={<PageNotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
