import cron from "node-cron";
import UserSettings from "../models/UserSettings.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { sendEmail } from "./emailService.js";

export const initCronJobs = () => {
  // Run at 00:00 on the 1st of every month
  cron.schedule("0 0 1 * *", async () => {
    console.log("Running monthly report cron job...");
    try {
      const usersToNotify = await UserSettings.find({ monthlyReports: true }).populate("user");
      
      const now = new Date();
      // Previous month
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      
      const monthName = startOfPrevMonth.toLocaleString('default', { month: 'long' });
      const year = startOfPrevMonth.getFullYear();

      for (const settings of usersToNotify) {
        if (!settings.user) continue;

        const transactions = await Transaction.find({
          user: settings.user._id,
          date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
        });

        const income = transactions.filter(t => t.type === 'Income').reduce((a, b) => a + Number(b.amount), 0);
        const expense = transactions.filter(t => t.type === 'Expense').reduce((a, b) => a + Number(b.amount), 0);
        const balance = income - expense;

        const html = `
          <h2>Monthly Report: \${monthName} \${year}</h2>
          <p>Hello \${settings.user.name}, here is your financial summary for the past month.</p>
          <ul>
            <li>Total Income: ₹\${income}</li>
            <li>Total Expense: ₹\${expense}</li>
            <li><strong>Balance: ₹\${balance}</strong></li>
          </ul>
          <p>Check your dashboard for more details.</p>
        `;

        await sendEmail(
          settings.user.email,
          `Monthly Expense Report: \${monthName} \${year}`,
          html
        ).catch(err => console.error(`Failed to send report to \${settings.user.email}:`, err));
      }
    } catch (error) {
      console.error("Error in monthly report cron:", error);
    }
  });
  
  console.log("Cron jobs initialized.");
};
