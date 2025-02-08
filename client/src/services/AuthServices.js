import AuthAPI from '../utils/AuthAPI';

const AuthServices = {

  async login(credentials) {
    return await AuthAPI.login(credentials)
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        // Wrong password
        if (error.response && error.response.status === 401) {
          throw new Error('Incorrect password. Please try again.');
        }

        // User not found
        if (error.response && error.response.status === 404) {
          throw new Error('User not found. Please try again.');
        }

        // Server error
        if (error.response && error.response.status === 500) {
          throw new Error('Internal server error. Please try again.')
        }

        throw error;
      });
  },

  async register(userData) {
    try {
      console.log('userData=' + userData);
      const response = await AuthAPI.register(userData);
      return response;
    } catch (error) {
      // Username already exists
      if (error.response && error.response.status === 409) {
        throw new Error('Username already exists. Please choose another.');
      }

      // Server error
      if (error.response && error.response.status === 500) {
        throw new Error('Internal server error. Please try again.')
      }
      
      throw error;
    }
  },

};

export default AuthServices;
