import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Code from "./pages/Code"
import Layout from "./Layout"
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from './components/Dashboard';
import DashboardHome from "./components/DashboardHome";
import Collections from "./components/Collections";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>

                    <Route path="" element={<Home />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="dashboard" element={<Dashboard />}>
                            <Route path="" element={<DashboardHome />} />
                            <Route path="collections" element={<Collections />} />
                        </Route>
                    </Route>

                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/code" element={<Code />} />
                    <Route path="/code/:roomId" element={<Code />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Registration />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;