import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Cells from "./pages/Cells.jsx";
import CellDetail from "./pages/CellDetail.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Board from "./pages/Board.jsx";
import Store from "./pages/Store.jsx";
import Partners from "./pages/Partners.jsx";
import Contact from "./pages/Contact.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";

import Overview from "./pages/dashboard/Overview.jsx";
import DashboardCells from "./pages/dashboard/DashboardCells.jsx";
import DashboardEvents from "./pages/dashboard/DashboardEvents.jsx";
import DashboardRegistrations from "./pages/dashboard/DashboardRegistrations.jsx";
import DashboardGallery from "./pages/dashboard/DashboardGallery.jsx";
import DashboardApplications from "./pages/dashboard/DashboardApplications.jsx";
import DashboardUsers from "./pages/dashboard/DashboardUsers.jsx";
import DashboardBoard from "./pages/dashboard/DashboardBoard.jsx";
import DashboardPartners from "./pages/dashboard/DashboardPartners.jsx";
import DashboardStore from "./pages/dashboard/DashboardStore.jsx";
import DashboardOrders from "./pages/dashboard/DashboardOrders.jsx";
import DashboardContent from "./pages/dashboard/DashboardContent.jsx";
import DashboardMessages from "./pages/dashboard/DashboardMessages.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cellules" element={<Cells />} />
        <Route path="/cellules/:slug" element={<CellDetail />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/evenements/:slug" element={<EventDetail />} />
        <Route path="/bureau" element={<Board />} />
        <Route path="/store" element={<Store />} />
        <Route path="/partenaires" element={<Partners />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rejoindre" element={<Join />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="cellules" element={<DashboardCells />} />
          <Route path="evenements" element={<DashboardEvents />} />
          <Route path="inscriptions" element={<DashboardRegistrations />} />
          <Route path="galerie" element={<DashboardGallery />} />

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="candidatures" element={<DashboardApplications />} />
            <Route path="utilisateurs" element={<DashboardUsers />} />
            <Route path="bureau" element={<DashboardBoard />} />
            <Route path="partenaires" element={<DashboardPartners />} />
            <Route path="boutique" element={<DashboardStore />} />
            <Route path="commandes" element={<DashboardOrders />} />
            <Route path="contenu" element={<DashboardContent />} />
            <Route path="messages" element={<DashboardMessages />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
