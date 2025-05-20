import axios from "axios";

const codeExecution = async (code, language, input) => {

    const url = `${import.meta.env.VITE_API_BASE_URL}/room/execute-code`;
    const data = {
        code,
        language,
        input,
    }
    const accessToken=localStorage.getItem('accessToken');
    const response = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        withCredentials: true,
    });

    console.log(response.data);
    return response.data.data;
    
}

export default codeExecution;