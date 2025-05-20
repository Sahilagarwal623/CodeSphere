import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyRoom } from '../api/roomApi.js'
import Code from '../pages/Code';
import Spinner from './Spinner';

export default function CodeRoomGuard() {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const passkey = searchParams.get('passkey');

        const checkAccess = async () => {
            try {
                await verifyRoom(roomId, passkey);
                setAuthorized(true);
            } catch (err) {
                navigate('/dashboard'); // fallback on error
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, []);

    if (loading) return <Spinner />;
    if (!authorized) return null; // Prevent flash

    return <Code />;
}
