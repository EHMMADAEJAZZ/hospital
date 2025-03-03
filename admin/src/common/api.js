import axios from 'axios';
// baseURL: 'https://hospital-api-wheat.vercel.app/api/v1',
const Axios = axios.create({
 baseURL: 'https://hospital-api-wheat.vercel.app/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
const endPoints = {
  admin: '/admin',
  doctor: '/doctor',
  user: '/user',
};
const apiEndPoints = {
  //post request
  createApi: async (url, data, token = '') => {
    try {
      const response = await Axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response', response);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error.response.data.message);
    }
  },
  //get request
  getApi: async (url) => {
    try {
      const response = await Axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //put request
  updateApi: async (url, data) => {
    try {
      const response = await Axios.put(url, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //delete request
  deleteApi: async (url) => {
    try {
      const response = await Axios.delete(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};

export default apiEndPoints;

export const doctorApis = {
  loginDoctor: async (data) => {
    try {
      const response = await Axios.post(`${endPoints.doctor}/login`, data);
      localStorage.setItem(
        'doctor_access_token',
        response?.data?.data?.accesstoken
      );
      localStorage.setItem(
        'doctor_refresh_token',
        response?.data?.data?.refreshToken
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //getDoctorAppointments
  getDoctorAppointments: async ( token = '') => {
    try {
      const response = await Axios.get(
        `${endPoints.doctor}/appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //getDoctorPatients
  getDoctorPatients: async (doctorId, token = '') => {
    try {
      const response = await Axios.get(
        `${endPoints.doctor}/patients?doctorId=${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //complete appointment
  completeAppointment: async (appointmentId, token = '') => {
    
    try {
      const response = await Axios.put(
        `${endPoints.doctor}/complete-appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //cancel appointment
  cancelAppointment: async (appointmentId, token = '') => {
    try {
      const response = await Axios.put(
        `${endPoints.doctor}/cancel-appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //logoutDoctor
  logoutDoctor: async (token = '') => {
    try {
      const response = await Axios.post(
        `${endPoints.doctor}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //check-auth
  checkAuth: async (token = '') => {
    try {
      const response = await Axios.get(`${endPoints.doctor}/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //doctor dashboard data
  getDoctorDashboardData: async (token = '') => {
    try {
      const response = await Axios.get(`${endPoints.doctor}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
//get doctor profile
  getDoctorProfile: async (token = '') => {
    try {
      const response = await Axios.get(`${endPoints.doctor}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
//update doctor profile
  updateDoctorProfile: async (data, token = '') => {
    try {
      const response = await Axios.put(`${endPoints.doctor}/edit-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },

};
export const adminApis = {
  loginAdmin: async (data) => {
    try {
      const response = await Axios.post(`${endPoints.admin}/login`, data);
      localStorage.setItem(
        'admin_access_token',
        response?.data?.data?.accesstoken
      );
      localStorage.setItem(
        'admin_refresh_token',
        response?.data?.data?.refreshToken
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //getAllDoctors
  getAllDoctors: async (token = '') => {
    try {
      const response = await Axios.get(`${endPoints.admin}/all-doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //getDoctorById
  getDoctorById: async (id) => {
    try {
      const response = await Axios.get(`${endPoints.admin}/doctor/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //createDoctor
  createDoctor: async (data) => {
    try {
      const response = await Axios.post(`${endPoints.admin}/doctor`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //changedoctor Availablity
  changeDoctorAvailability: async (id, token) => {
    try {
      const response = await Axios.post(
        `${endPoints.admin}/doctor/availability`,
        {
          doctorId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //deleteDoctor
  deleteDoctor: async (id, token = '') => {
    try {
      const response = await Axios.delete(`${endPoints.admin}/doctor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //appointments
  getAllAppointments: async (token = '') => {
    try {
      const response = await Axios.get(`${endPoints.admin}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //cancel appointment
  cancelAppointment: async (appointmentId, token = '') => {
    try {
      const response = await Axios.post(
        `${endPoints.admin}/appointment/cancel`,
        {
          appointmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
     
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //get admin dashboard data
  getAdminDashboardData: async (token = '') => {
    try {
      const response = await Axios.get(`${endPoints.admin}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //logoutAdmin

  logoutAdmin: async (token = '') => {
    try {
      const response = await Axios.post(
        `${endPoints.admin}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // localStorage.removeItem('admin_access_token');
      // localStorage.removeItem('admin_refresh_token');
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  //check-auth
  checkAuth: async (token = '') => {
    try {
      const response = await Axios.get(`${endPoints.admin}/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
};
