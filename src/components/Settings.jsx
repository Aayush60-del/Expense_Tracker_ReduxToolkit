import '../App.css';

const Settings = ({ setTheme }) => {
  return (
    <div className="settingsPage">
      {/* Header */}
      <div className="settingsHeader">
        <div>
          <h1>
            <strong>Settings</strong>
          </h1>
          <p>Manage your preference and account</p>
        </div>

        <img
          src="https://via.placeholder.com/42"
          alt="user"
        />
      </div>

      {/* Profile Settings */}
      <div className="profile">
        <h2>
          <strong>Profile Settings</strong>
        </h2>

        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="user34@gmail.com"
          />
        </div>

        <div>
          <label>Currency</label>
          <select>
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* Preferences */}
        <h2>
          <strong>Preferences</strong>
        </h2>

        <div className="themeButtons">
          <button onClick={() => setTheme(true)}>
            Light
          </button>

          <button onClick={() => setTheme(false)}>
            Dark
          </button>
        </div>

        {/* Notifications */}
        <h2>
          <strong>Notifications</strong>
        </h2>

        <div className="notificationRow">
          <h3>Email Notifications</h3>

          <button className="toggle">
            <div></div>
          </button>
        </div>

        <div className="notificationRow">
          <h3>Transaction Alerts</h3>

          <button className="toggle">
            <div></div>
          </button>
        </div>

        <div className="notificationRow">
          <h3>Monthly Reports</h3>

          <button className="toggle">
            <div></div>
          </button>
        </div>

        {/* Account */}
        <h2>
          <strong>Account</strong>
        </h2>

        <div className="accountButtons">
          <button className="changePassword">
            Change Password
          </button>

          <button className="logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;