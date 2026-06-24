export const getWelcomeEmail = (name) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; margin-top: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; text-decoration: none; }
        .content { color: #334155; line-height: 1.6; font-size: 16px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="logo">ExpenseTracker</span>
        </div>
        <div class="content">
            <h2>Welcome to ExpenseTracker, ${name}!</h2>
            <p>We're thrilled to have you on board. Your journey to better financial health starts today.</p>
            <p>With ExpenseTracker, you can easily log transactions, monitor your budget, and gain insights into your spending habits.</p>
            <div style="text-align: center;">
                <a href="${process.env.CLIENT_URL}" class="button">Go to Dashboard</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getOtpEmail = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; margin-top: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; text-decoration: none; }
        .content { color: #334155; line-height: 1.6; font-size: 16px; text-align: center; }
        .otp-box { display: inline-block; padding: 16px 32px; background-color: #f1f5f9; color: #0f172a; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="logo">ExpenseTracker</span>
        </div>
        <div class="content">
            <h2>Your Verification Code</h2>
            <p>Please use the following OTP to complete your verification.</p>
            <div class="otp-box">${otp}</div>
            <p>This code will expire in 5 minutes.</p>
            <p style="font-size: 14px; color: #64748b; mt-4">If you didn't request this code, please safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getTransactionAlertEmail = (transaction) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; margin-top: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; text-decoration: none; }
        .content { color: #334155; line-height: 1.6; font-size: 16px; }
        .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 20px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .label { font-weight: bold; color: #475569; }
        .value { color: #0f172a; }
        .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 14px; }
        .amount-Expense { color: #ef4444; font-weight: bold; }
        .amount-Income { color: #22c55e; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="logo">ExpenseTracker</span>
        </div>
        <div class="content">
            <h2>New Transaction Alert</h2>
            <p>A new transaction has been recorded on your account.</p>
            <div class="card">
                <div class="row">
                    <span class="label">Type</span>
                    <span class="value">${transaction.type}</span>
                </div>
                <div class="row">
                    <span class="label">Amount</span>
                    <span class="amount-${transaction.type}">${transaction.type === 'Income' ? '+' : '-'}₹${transaction.amount}</span>
                </div>
                <div class="row">
                    <span class="label">Category</span>
                    <span class="value">${transaction.category}</span>
                </div>
                <div class="row">
                    <span class="label">Description</span>
                    <span class="value">${transaction.description || 'N/A'}</span>
                </div>
                <div class="row">
                    <span class="label">Date</span>
                    <span class="value">${new Date(transaction.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.CLIENT_URL}/transactions" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">View All Transactions</a>
            </div>
        </div>
        <div class="footer">
            <p>You received this email because transaction alerts are enabled in your settings.</p>
            <p>&copy; ${new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getBudgetAlertEmail = (percentage, budget, currentSpent, isCritical) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; margin-top: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border-top: 4px solid ${isCritical ? '#ef4444' : '#f59e0b'}; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #2563eb; font-size: 24px; font-weight: bold; text-decoration: none; }
        .content { color: #334155; line-height: 1.6; font-size: 16px; text-align: center; }
        .alert-title { color: ${isCritical ? '#ef4444' : '#d97706'}; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .progress-container { width: 100%; background-color: #e2e8f0; border-radius: 9999px; height: 16px; margin: 30px 0; overflow: hidden; }
        .progress-bar { height: 100%; background-color: ${isCritical ? '#ef4444' : '#f59e0b'}; width: ${Math.min(percentage, 100)}%; border-radius: 9999px; }
        .stats { display: flex; justify-content: space-around; background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .stat-box { text-align: center; }
        .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
        .stat-value { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 4px; }
        .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="logo">ExpenseTracker</span>
        </div>
        <div class="content">
            <div class="alert-title">
                ${isCritical ? '🚨 Budget Exceeded!' : '⚠️ Budget Warning'}
            </div>
            <p>You have reached <strong>${percentage}%</strong> of your monthly budget.</p>
            
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-label">Spent</div>
                    <div class="stat-value">₹${currentSpent}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Budget</div>
                    <div class="stat-value">₹${budget}</div>
                </div>
            </div>
            
            <p>${isCritical ? 'You have exceeded your monthly budget. Try to cut down on non-essential expenses.' : 'You are approaching your budget limit. Keep an eye on your upcoming expenses.'}</p>
        </div>
        <div class="footer">
            <p>You received this email because budget alerts are enabled in your settings.</p>
            <p>&copy; ${new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
