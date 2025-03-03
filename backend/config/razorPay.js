import dotenv from 'dotenv';
dotenv.config();
import razorpay from "razorpay";

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(options) {
    try {
        const response = await razorpayInstance.orders.create(options);
        return response;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

//fetch order
async function verifyPayment(orderId) {
    console.log(orderId)
    try {
        const response = await razorpayInstance.orders.fetch(orderId);
        return response;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
}



export {createOrder,verifyPayment}