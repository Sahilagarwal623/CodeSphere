import React from "react";
import { NavLink, Link } from "react-router-dom";
import WebsiteIcon from './WebLogo1.png';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logoutUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
export default function Header() {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [profileurl, setProfileUrl] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn && user?.profilepicture) {
            setProfileUrl(user.profilepicture);
        }
    }, [isLoggedIn, user?.profilepicture]);

    function handleprofilebutton() {
        setDropdownOpen(!dropdownOpen);
    }

    async function handleLogout() {

        await logoutUser();
        navigate("/");
    }


    return (
        <header className="shadow sticky z-50">
            <nav className="bg-gray-900 shadow-md shadow-slate-400 flex border-gray-200 py-2">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={WebsiteIcon}
                        className="w-48 h-14 rounded-lg"
                        alt="Logo"
                    />
                </Link>
                <div className="max-w-screen w-full flex items-center mx-auto justify-between">


                    {/* Centered Nav Links */}
                    <div className="flex-1 flex justify-center">
                        <ul className="flex gap-8 font-medium">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `py-2 duration-200 ${isActive ? "text-green-500" : "text-white"
                                        } hover:text-green-400`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `py-2 duration-200 ${isActive ? "text-green-500" : "text-white"
                                        } hover:text-green-400`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Right Side Auth / Avatar */}
                    {!isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="text-white font-medium rounded-lg text-sm px-4 py-2 hover:bg-slate-800"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="text-white font-medium rounded-lg text-sm px-4 py-2 hover:bg-slate-800"
                            >
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div onClick={handleprofilebutton} className="w-10 mr-2 h-10 rounded-full overflow-hidden border-2 border-yellow-400 cursor-pointer">
                            <img
                                src={profileurl} // Placeholder image
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                            {dropdownOpen && (
                                <ul className="bg-black z-10 absolute right-2 top-14 w-40 rounded-md shadow-lg p-2">
                                    <div className="flex flex-col gap-2">
                                        <li onClick={handleLogout} className="bg-gray-800 text-white p-2 rounded-md mt-2 hover:bg-gray-600">Logout</li>
                                    </div>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
