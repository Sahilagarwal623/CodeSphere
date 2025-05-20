import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { joinRoom, createRoom } from '../api/roomApi.js';

export default function DashboardHome() {


    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomPasskeyInput, setRoomPasskeyInput] = useState("");
    const [roomId, setRoomId] = useState("");

    const [passkeyInput, setPasskeyInput] = useState("");
    const navigate = useNavigate();
    const [errormessage, seterrormessage] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    const [spinner, setSpinner] = useState(true)

    useEffect(() => {

        const timer = setTimeout(() => {
            setSpinner(false)
        }, 1500)

        return () => clearTimeout(timer)

    }, [])


    const handleJoinRoom = async () => {
        // Handle the logic to join the room
        console.log("Joining room...");

        try {
            await joinRoom(roomId, roomPasskeyInput);
            navigate(`/code/${roomId}?mode=online&passkey=${roomPasskeyInput}`);

        } catch (error) {
            seterrormessage(error.message);
            setShowErrorPopup(true);
            return;
        }

    }

    const handleCreateRoom = async () => {
        // Handle the logic to create a new room
        console.log("Creating room...");

        try {
            const randomId = uuidv4();
            const { passkey } = await createRoom(randomId, passkeyInput);
            navigate(`/code/${randomId}?mode=online&passkey=${passkey}`);

        } catch (error) {
            setShowErrorPopup(true);
            seterrormessage(error.message)
            return;
        }
    }

    if (spinner) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner />
            </div>)
    }
    return (
        <div className="flex-1 flex flex-col">
            {/* Top Navbar */}
            <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
            </header>

            {/* Content */}
            <main className="p-6 bg-gray-100 flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Welcome back 👋
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Online CodeSpace Room</h3>
                        <button onClick={() => setShowJoinModal(true)} className='p-2 m-2 bg-gray-600 text-white rounded-lg hover:text-gray-200'>Join room</button>
                        <button onClick={() => setShowCreateModal(true)} className='p-2 m-2 bg-gray-600 text-white rounded-lg hover:text-gray-200'>Create room</button>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-8">Local Codespace</h3>
                        <Link to="/code?mode=local" className='mt-4 p-2 m-2 bg-gray-600 text-white rounded-lg hover:text-gray-200'>Code Editor</Link>
                    </div>
                </div>

                {showJoinModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 w-80">
                            <h3 className="text-lg font-semibold mb-4">Join a Room</h3>
                            <input
                                type="text"
                                placeholder="Enter RoomId"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Enter Room passkey"
                                value={roomPasskeyInput}
                                onChange={(e) => setRoomPasskeyInput(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={() => {
                                        handleJoinRoom();
                                        setShowJoinModal(false);
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Join
                                </button>
                                <button
                                    onClick={() => setShowJoinModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 w-80">
                            <h3 className="text-lg font-semibold mb-4">Create a Room</h3>
                            <input
                                type="text"
                                placeholder="Create Passkey"
                                value={passkeyInput}
                                onChange={(e) => setPasskeyInput(e.target.value)}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={() => {
                                        handleCreateRoom();
                                        setShowCreateModal(false);
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showErrorPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-md w-80">
                            <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
                            <p className="text-gray-800 mb-4">{errormessage}</p>
                            <div className="text-right">
                                <button
                                    onClick={() => setShowErrorPopup(false)}
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </main>
        </div>
    )
}