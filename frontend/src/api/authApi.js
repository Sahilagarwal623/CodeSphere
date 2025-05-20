import axios from "axios";


const registerUser = async (formdata) => {

  console.log(formdata);
  // console.log(typeof formdata);
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, formdata, {
      withCredentials: true,
    });
    // console.log(response.data);
    // console.log("success: ",response.data.success);


    return {
      success: response.data.success,
      message: response.data.message || 'Registration successful!',
    }
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    throw new Error(error.response?.data?.message || 'Registration failed.');

  }
}



const loginUser = async (formdata) => {
  try {
    const accessToken=localStorage.getItem('accessToken');
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, formdata, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed.');
  }
};



const logoutUser = async () => {
  try {
    const accessToken=localStorage.getItem('accessToken');
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/logout`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed.');
  }
}

export { registerUser, loginUser, logoutUser };