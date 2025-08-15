import CodeEditor from "../components/CodeEditor";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRef } from "react";
import codeExecution from "../api/codeExecution";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authApi";
import { useSearchParams } from "react-router-dom";
import { leaveRoom, addcode } from "../api/roomApi";
import { useLocation, useNavigationType } from 'react-router-dom';

export default function Code() {

    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode") || "local"; // fallback to local
    const passkey = searchParams.get("passkey");
    const { roomId } = useParams();
    const username = useSelector(state => state.auth.user.username);
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [profileurl, setProfileUrl] = useState(null);
    const editorRef = useRef(null);
    const [language, setlanguage] = useState("c++");
    const [Console, setopenconsole] = useState(true);
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [socketInitialized, setsocketInitialized] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const navigationType = useNavigationType();
    const isInitialMount = useRef(true);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');

    const handleCollections = () => {
        setShowModal(true);
    };

    const handleSubmit = () => {
        console.log('Submitted title:', title);
        if (editorRef.current) {
            const currentCode = editorRef.current.getValue();
            console.log(currentCode);
            addcode(currentCode, title).then((res) => {
                console.log(res);
                alert("Code added to collections");
            }).catch((err) => {
                console.log(err);
                alert("Error adding code to collections");
            }
            );
        }
        setShowModal(false);
        setTitle('');
    };

    const [copied, setCopied] = useState("");

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(label);
            setTimeout(() => setCopied(""), 1500);
        });
    };

    useEffect(() => {

        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const checkBackNav = async () => {
            console.log("triggered");

            // navigationType is “POP” on back/forward
            if (navigationType === "POP" && mode === "online") {
                await handleLeave();   // ✅ valid here
                console.log("Left room");
            }
        };

        checkBackNav();
    }, [location, navigationType, mode]);


    useEffect(() => {
        if (isLoggedIn && user?.profilepicture) {
            setProfileUrl(user.profilepicture);
        }
    }, [isLoggedIn, user?.profilepicture]);

    async function executeCode() {

        if (loading) {
            return;
        }

        setLoading(true);
        let type = "cpp";

        switch (language) {
            case "c++":
                type = "cpp";
                break;
            case "python":
                type = "py";
                break;

            case "javascript":
                type = "js";
                break;
            case "java":
                type = "java";
                break;
        }
        const code = editorRef.current.getValue();
        const result = await codeExecution(code, type || "cpp", input);
        setLoading(false);
        console.log("this is result: ", result);
        if (result.output) {
            setOutput(result.output);
        }
        else {
            setOutput(result.error.split('\n').slice(1).join('\n') || "error: maybe be language not supported or there is infinite loop in your code");
        }
    }

    function handleprofilebutton() {
        setDropdownOpen(!dropdownOpen);
    }

    async function handleLogout() {

        await logoutUser();
        navigate("/");
    }

    function handleInput(e) {
        setInput(e.target.innerText);
    }

    function sendMessage() {

        if (chatInput.trim() !== '' && socketRef.current) {
            socketRef.current?.emit('send-message', { username, message: chatInput });
            setChatInput('');
        }
    }

    function getSocket(socket) {

        socketRef.current = socket;

    }

    const handleLeave = async () => {
        if (socketRef.current) {
            socketRef.current.emit('leaveRoom', { roomId, username });
            try {
                await leaveRoom(roomId);
                console.log('Left the room!');
                navigate('/dashboard');
            } catch (error) {
                console.log(error);
            }
        }
        return;
    };

    useEffect(() => {
        if (mode !== 'online') {
            return;
        }
        if (socketRef.current) {
            socketRef.current.on('send-message', ({ username, message }) => {
                setMessages(prevMessages => [...prevMessages, { username, message }]);
            })
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off('send-message');
            }
        }
    }, [socketInitialized]);





    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="h-screen w-screen flex flex-col">
            <div className="w-full p-3 h-14 bg-slate-900 flex items-center justify-between relative">

                {/* Centered Buttons */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
                    <button onClick={executeCode} className="px-3 py-1 bg-zinc-800 rounded-md text-gray-200 mx-2 shadow-sm shadow-gray-600">
                        Run
                    </button>
                    {!showModal && (
                        <button
                            onClick={handleCollections}
                            className="px-3 py-1 bg-zinc-800 rounded-md text-yellow-600 shadow-sm shadow-gray-600"
                        >
                            Add code to collections
                        </button>
                    )
                    }

                    {showModal && (
                        <div className="bg-slate-900 mx-2 w-auto space-x-4 rounded-lg shadow-lg flex items-center justify-center">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border rounded-md"
                                placeholder="Document Title"
                            />
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    {
                        (mode === 'online') && (
                            <button onClick={handleLeave} className="ml-2 px-3 py-1 bg-red-800 rounded-md text-white shadow-sm shadow-gray-600">
                                Leave room
                            </button>
                        )
                    }
                </div>

                {/* Avatar on Right */}
                <div onClick={handleprofilebutton} className="w-10 h-10 rounded-full ml-auto overflow-hidden border-2 border-yellow-400 cursor-pointer">
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
            </div>

            <div className="h-full w-full flex p-1 gap-1 bg-gray-400">
                {/* Left Half */}

                {mode === 'online' && (

                    <div className="w-1/2 h-full bg-zinc-950 text-white p-10 rounded-md relative gap-2">

                        <div className="absolute bottom-3 left-3 right-3 border-2 border-gray-300 bg-black rounded-md flex flex-col top-2">
                            {/* Chat messages area */}
                            <div className="w-full h-auto bg-black flex flex-wrap items-center justify-between border-gray-300 border-b-2 p-4 gap-4">
                                {/* Room ID */}
                                <div className="flex items-center gap-2">
                                    <pre className="bg-black p-2 rounded-lg text-green-200 whitespace-pre-wrap break-words">
                                        roomId: {roomId}
                                    </pre>
                                    <button
                                        onClick={() => handleCopy(roomId, "roomId")}
                                        className="text-sm text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                                    >
                                        {copied === "roomId" ? "Copied!" : "Copy"}
                                    </button>
                                </div>

                                {/* Passkey */}
                                <div className="flex items-center gap-2">
                                    <pre className="bg-black p-2 rounded-lg text-green-200 whitespace-pre-wrap break-words">
                                        passkey: {passkey}
                                    </pre>
                                    <button
                                        onClick={() => handleCopy(passkey, "passkey")}
                                        className="text-sm text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                                    >
                                        {copied === "passkey" ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                                {messages.map((data, index) => (
                                    <div key={index} className="flex flex-col space-y-2 bg-black p-2">
                                        <div className="flex flex-col space-x-2">
                                            {/* Username in a small rounded span */}
                                            <span className="bg-blue-500 p-1 rounded-full w-min">{data.username}</span>
                                            {/* Message content */}
                                            <pre className="text-white bg-blue-600 whitespace-pre-wrap break-words rounded-md p-2 mt-2">{data.message}</pre>
                                        </div>
                                    </div>

                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat input */}
                            <div className="mt-2 flex">
                                <textarea
                                    placeholder="Type a message..."
                                    className="flex-1 bg-black text-white p-2 rounded-l-lg outline-none resize-none overflow-hidden"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    rows={1}
                                />

                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-700 hover:bg-green-700 text-white p-2 rounded-r-lg"

                                >
                                    Send
                                </button>
                            </div>
                        </div>

                    </div>
                )}


                {/* Right Half */}
                <div className={`${mode === 'online' ? 'w-1/2' : 'w-full'} bg-gray-800 rounded-md relative`}>

                    <CodeEditor
                        getSocket={getSocket}
                        setsocketInitialized={setsocketInitialized}
                        mode={mode}
                        setlanguage={setlanguage}
                        language={language}
                        getEditorRef={(editor) => (editorRef.current = editor)}
                        Console={Console}
                        setopenconsole={setopenconsole}
                    />

                    {/* Output Section */}
                    <div className={`absolute bottom-0 right-0 w-full h-1/2 bg-zinc-900 text-gray-200 p-4 rounded-t-md overflow-auto scrollbar-hide z-10 flex-row ${Console ? "" : "hidden"}`}>
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Output: (May not displayed due to charges on aws)</h2>
                            <pre className="bg-gray-700 p-2 rounded-md overflow-auto h-32 scrollbar-hide">
                                {/* Output content goes here */}
                                {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    : <p>{output}</p>}
                            </pre>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Input:</h2>
                            <pre onInput={handleInput} className="bg-gray-700 p-2 rounded-md overflow-auto h-32 scrollbar-hide" contentEditable="true" suppressContentEditableWarning="true">
                                <p></p>
                            </pre>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
