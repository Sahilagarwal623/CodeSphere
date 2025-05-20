import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateLoginStatus } from '../store/userActions';
import axios from 'axios';

const PrivateRoute = () => {
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
                        username: response.data.data.username,
                        profilepicture: response.data.data.profilepicture,
                    }));
                } else {
                    dispatch(updateLoginStatus({
                        isLoggedIn: false,
                        username: "",
                        profilepicture: "",
                    }));
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                dispatch(updateLoginStatus({
                    isLoggedIn: false,
                    username: "",
                    profilepicture: "",
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

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
