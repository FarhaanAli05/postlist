import axios from "axios";

async function getUser(user) {
  const response = await axios.post('http://localhost:8000/api/getuser/', {
    username: user
  });
  return response.data.username;
}

export default getUser;