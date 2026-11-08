import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "./PrivateRoute";

import Home from "../pages/Home";
import Places from "../pages/Places";
import PlaceDetail from "../pages/PlaceDetail";
import OcopProducts from "../pages/OcopProducts";
import OcopDetail from "../pages/OcopDetail";
import Culture from "../pages/Culture";
import CultureDetail from "../pages/CultureDetail";
import MapPage from "../pages/MapPage";
import Foods from "../pages/Foods";
import FoodDetail from "../pages/FoodDetail";
import Events from "../pages/Events";
import EventDetail from "../pages/EventDetail";
import TravelInfo from "../pages/TravelInfo";
import Chat from "../pages/Chat";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

import Dashboard from "../pages/admin/Dashboard";
import AdminResource from "../pages/admin/AdminResource";
import { resources } from "../pages/admin/resources";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:id" element={<PlaceDetail />} />
        <Route path="/ocop" element={<OcopProducts />} />
        <Route path="/ocop/:id" element={<OcopDetail />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/culture/:id" element={<CultureDetail />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/foods/:id" element={<FoodDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/info" element={<TravelInfo />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {Object.entries(resources).map(([key, config]) => (
            <Route key={key} path={key} element={<AdminResource config={config} />} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
}
