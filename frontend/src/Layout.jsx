import React from "react";
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div className="min-h-screen w-full">
            <Header />

            <main className=" bg-gray-900 w-full">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default Layout;
