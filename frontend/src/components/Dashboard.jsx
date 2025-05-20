import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Navigation</h2>
                <nav className="flex flex-col space-y-4">
                    <ul className="flex flex-col gap-8 font-medium">
                        <li>
                            <NavLink
                                to="/dashboard"
                                end
                                className={({ isActive }) =>
                                    `py-2 duration-200 ${isActive ? "text-green-500" : "text-white"
                                    } hover:text-green-400`
                                }
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/collections"
                                end
                                className={({ isActive }) =>
                                    `py-2 duration-200 ${isActive ? "text-green-500" : "text-white"
                                    } hover:text-green-400`
                                }
                            >
                                Collections
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
            <Outlet />
        </div>
    );
}
