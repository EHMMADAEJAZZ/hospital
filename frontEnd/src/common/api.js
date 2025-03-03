import axios from "axios"
// baseURL: 'https://hospital-api-wheat.vercel.app/api/v1',
const Axios = axios.create({
 baseURL: 'https://hospital-api-wheat.vercel.app/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('user_access_token')}`
  },
});
const apiEndPoints = {
    doctor:"/doctor",
    user:"/user",
    appointment:'/appointment'
};
//userEndPoinst
export const userEndPoints ={
    //registerUser
    registerUser: async (userData) => {
      try {
        const response = await Axios.post(`${apiEndPoints.user}/register`, userData);
        return response.data;
        
      } catch (error) {
        throw new Error(error?.response?.data?.message);
        
      }
        // const response = await Axios.post(`${apiEndPoints.user}/register`, userData);
        // return response.data;
    },
    //loginUser
    loginUser: async (userData) => {
      try {
        const response = await Axios.post(`${apiEndPoints.user}/login`, userData);
        console.log(response?.data?.data?.accesstoken);
        localStorage.setItem("user_access_token", response.data?.data?.accesstoken);
        localStorage.setItem("user_refresh_token", response.data?.data?.refreshToken)
        return response.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message);
        
      }
        
    },
    //getUserProfile
    getUserProfile: async (token) => {
      try {
        const response = await Axios.get(`${apiEndPoints.user}/check-auth`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
        
      } catch (error) {
        throw new Error(error?.response?.data?.message);
        
      }
        
    },
    //updateUserProfile
    updateUserProfile: async (userData,token) => {
      try {
        const response = await Axios.put(`${apiEndPoints.user}/profile`, userData,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
        
      } catch (error) {
        throw new Error(error?.response?.data?.message);
        
      }
        
    },
    //logoutUser
    logoutUser: async (token) => {
      try {
        const response = await Axios.post(`${apiEndPoints.user}/logout`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         localStorage.removeItem("user_access_token");
         localStorage.removeItem("user_refresh_token");
        return response.data;
        
      } catch (error) {
        throw new Error(error?.response?.data?.message);
        
      }
     
    },
}
//doctorEndPoints
export const doctorEndPoints ={
    //getAllDoctors
    getAllDoctors: async () => {
        const response = await Axios.get(apiEndPoints.doctor);
        return response.data;
    },
    //getDoctorById
    getDoctorById: async (doctorId) => {
        const response = await Axios.get(`${apiEndPoints.doctor}/${doctorId}`);
        return response.data;
    },
    
}
//appointmentEndPoints
export const appointmentEndPoints ={
    //createAppointment
    createAppointment: async (appointmentData,doctorId) => {
       try {
         const response = await Axios.post(`${apiEndPoints.appointment}/${doctorId}`, appointmentData);
         console.log(response)
         return response.data;
        
       } catch (error) {
         throw new Error(error?.response?.data?.message);
        
       }
    },
    //getPatientsAppointments
    getPatientsAppointments: async (token) => {
        try {
          const response = await Axios.get(`${apiEndPoints.appointment}/appointments`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
          
        } catch (error) {
          throw new Error(error?.response?.data?.message);
          
        }
    },
   
    //cancelAppointment
    cancelAppointment: async (appointmentId,token) => {
        try {
          const response = await Axios.post(`${apiEndPoints.appointment}/cancelappointment/${appointmentId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
          
        } catch (error) {
          throw new Error(error?.response?.data?.message);
          
        }
    },
//razorpay payment
    createPayment: async (appointment_id,token) => {
      try {
        const response = await Axios.post(`${apiEndPoints.appointment}/razorpay-payment/${appointment_id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
        
      } catch (error) {
        throw new Error(error?.response?.data?.message);
      }
    },
    //veifypayment
    verifyRazorpayPayment:async(orderData,token)=>{
      
      try {
        const response = await Axios.patch(`${apiEndPoints.appointment}/verify-razorpay-payment`,
          orderData
        ,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error?.response?.data?.message);
      }
    }


    
}
