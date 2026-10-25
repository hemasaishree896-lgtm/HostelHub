import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Complaints from "./pages/Complaints";
import Leaves from "./pages/Leaves";
import Mess from "./pages/Mess";
import Notices from "./pages/Notices";
import Profile from "./pages/Profile";
import WardenDashboard from "./pages/WardenDashboard";

import ProtectedRoute from "./ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC PAGES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            STUDENT DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">

              <Dashboard />

            </ProtectedRoute>
          }
        />


        {/* =========================
            STUDENT PAGES
        ========================= */}

        <Route
          path="/rooms"
          element={
            <ProtectedRoute role="student">

              <Rooms />

            </ProtectedRoute>
          }
        />


        <Route
          path="/complaints"
          element={
            <ProtectedRoute>

              <Complaints />

            </ProtectedRoute>
          }
        />


        <Route
          path="/leaves"
          element={
            <ProtectedRoute>

              <Leaves />

            </ProtectedRoute>
          }
        />


        <Route
          path="/mess"
          element={
            <ProtectedRoute>

              <Mess />

            </ProtectedRoute>
          }
        />


        <Route
          path="/notices"
          element={
            <ProtectedRoute>

              <Notices />

            </ProtectedRoute>
          }
        />


        {/* =========================
            STUDENT PROFILE
        ========================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="student">

              <Profile />

            </ProtectedRoute>
          }
        />


        {/* =========================
            WARDEN DASHBOARD
        ========================= */}

        <Route
          path="/warden-dashboard"
          element={
            <ProtectedRoute role="warden">

              <WardenDashboard />

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;