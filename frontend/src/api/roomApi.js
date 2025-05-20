import axios from "axios";


const joinRoom = async (roomId, passkey) => {


    try {
        const accessToken = localStorage.getItem('accessToken');

        const url = `${import.meta.env.VITE_API_BASE_URL}/room/verify-key`;
        const data = {
            roomId,
            passkey,
        }

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });

        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw new Error(error?.response?.data?.message);
    }
}

const createRoom = async (roomId, passkey) => {

    try {
        const accessToken = localStorage.getItem('accessToken');

        const url = `${import.meta.env.VITE_API_BASE_URL}/room/create-room`;
        const data = {
            roomId,
            passkey,
        }

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });

        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw new Error(error?.response?.data?.message);
    }
}


const leaveRoom = async (roomId) => {

    try {
        const accessToken = localStorage.getItem('accessToken');

        const url = `${import.meta.env.VITE_API_BASE_URL}/room/leave-room`;
        const data = {
            roomId,
        }

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });

        console.log(response.data);
        return response.data.data;
    } catch (error) {
        throw new Error("cannot leave room");
        
    }

}

const addcode = async (code, title) => {
    try {
        const accessToken = localStorage.getItem('accessToken');

        const url = `${import.meta.env.VITE_API_BASE_URL}/room/add-code`;
        const data = {
            content: code,
            title,
        }

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            withCredentials: true,
        });

        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw new Error(error?.response?.data?.message);
    }
}

export { joinRoom, leaveRoom, createRoom, addcode }