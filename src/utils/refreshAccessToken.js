import Cookies from 'js-cookie';
import axios from 'axios';

const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      console.error('Refresh token not found. User needs to log in again.');
      return null;
    }
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken
    });
    const { access: newAccessToken, refresh: newRefreshToken } = response.data;
    if (newRefreshToken) {
      Cookies.set('refresh_token', newRefreshToken, { secure: true, sameSite: 'strict' })
    }
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token', error);
    return null;
  }
};

export default refreshAccessToken;