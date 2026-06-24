import nodemailer from "nodemailer";
import * as templates from "./emailTemplates.js";

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

export const sendEmail = async (to, subject, html) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log("Email credentials not configured. Skipping email send.");
            return;
        }

        const transporter = createTransporter();
        const mailOptions = {
            from: `"ExpenseTracker" <\${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export const sendWelcomeEmail = async (to, name) => {
    return sendEmail(
        to,
        "Welcome to ExpenseTracker!",
        templates.getWelcomeEmail(name)
    );
};

export const sendOtpEmail = async (to, otp, isReset = false) => {
    const subject = isReset ? "Password Reset Verification Code" : "Your Login Verification Code";
    return sendEmail(
        to,
        subject,
        templates.getOtpEmail(otp)
    );
};

export const sendTransactionAlert = async (to, transaction) => {
    return sendEmail(
        to,
        `New \${transaction.type} Alert: ₹\${transaction.amount}`,
        templates.getTransactionAlertEmail(transaction)
    );
};

export const sendBudgetAlert = async (to, percentage, budget, currentSpent) => {
    const isCritical = percentage >= 100;
    const subject = isCritical ? "🚨 Budget Exceeded Alert" : "⚠️ Budget Warning Alert";
    return sendEmail(
        to,
        subject,
        templates.getBudgetAlertEmail(percentage, budget, currentSpent, isCritical)
    );
};

// We will add monthly report email later when we set up node-cron
