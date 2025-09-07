import dotenv from "dotenv";
dotenv.config();
import Twilio from "twilio";
import Order from "../models/orders.js"; // adjust path if needed


const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

console.log("Twilio number from env:", process.env.TWILIO_PHONE_NUMBER);

export const placeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // fetch order with user and address
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("address"); 

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Get phone number from address first, fallback to user
    const phoneNumber = order.address?.phone || order.user?.phone;
    if (!phoneNumber) {
      return res.status(400).json({ message: "User phone number not found" });
    }

    // Get Twilio number from env
    const rawFromNumber = process.env.TWILIO_PHONE_NUMBER?.trim();
    if (!rawFromNumber) {
      return res.status(500).json({ message: "TWILIO_PHONE_NUMBER is not set in .env" });
    }

    // Ensure both numbers are in E.164 format
    const fromNumber = rawFromNumber.startsWith("+") ? rawFromNumber : `+91${rawFromNumber}`;
    const toNumber = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

    // Send SMS
    await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: `Hi ${order.user.name}, your order #${orderId} has been placed!`,
    });

    res.json({ message: "SMS sent successfully" });
  } catch (err) {
    console.error("SMS Error:", err);
    res.status(500).json({ message: "Failed to send SMS", error: err.message });
  }
};
