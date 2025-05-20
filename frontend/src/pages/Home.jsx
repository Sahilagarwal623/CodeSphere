import LandingPage from "../components/LandingPage";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";
import { updateLoginStatus } from "../store/userActions";
function Home() {
    const { isLoggedIn } = useSelector((state) => state.auth);
    const [spinner, setSpinner] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const accessToken=localStorage.getItem('accessToken');
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/validate-token`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                });

                if (response.data.statusCode === 200) {
                    dispatch(updateLoginStatus({
                        isLoggedIn: true,
                        username: "", // Optional: populate if available
                        isAuthChecked: true,
                    }));
                } else {
                    dispatch(updateLoginStatus({
                        isLoggedIn: false,
                        username: "",
                        isAuthChecked: true,
                    }));
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                dispatch(updateLoginStatus({
                    isLoggedIn: false,
                    username: "",
                    isAuthChecked: true,
                }));
            } finally {
                const delay = setTimeout(() => {
                    setSpinner(false);
                }, 2000); // Optional delay for smooth transition
                return () => clearTimeout(delay);
            }
        };

        validateToken();
    }, [dispatch]);

    if (spinner) {
        return <Spinner />;
    }

    return isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />;

}

export default Home;