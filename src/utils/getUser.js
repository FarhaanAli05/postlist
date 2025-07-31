import axios from "axios";

async function getUser(user) {
  try {
    const response = await axios.post('http://localhost:8000/api/getuser/', {
      username: user
    });
    return response.data.username;
  } catch (e) {
    if (e.response.status === 404) {
      alert('Could not find user!');
    }
  }
}

export default getUser;