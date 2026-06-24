import fs from "fs";

function patch(file, fn) {
  if (!fs.existsSync(file)) {
    console.log("skip", file);
    return;
  }

  const oldCode = fs.readFileSync(file, "utf8");
  const newCode = fn(oldCode);

  if (newCode !== oldCode) {
    fs.writeFileSync(file, newCode, "utf8");
    console.log("patched", file);
  } else {
    console.log("no change", file);
  }
}

patch("server/controllers/authController.js", (code) => {
  const start = code.indexOf("export const uploadAvatar = asyncHandler(async (req, res) => {");
  const end = code.indexOf("// @desc    Change password", start);

  if (start === -1 || end === -1) return code;

  const replacement = `export const uploadAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  const avatarUrl = \`/uploads/\${req.file.filename}\`;

  user.avatar = avatarUrl;
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    currency: updatedUser.currency,
    avatar: updatedUser.avatar,
    avatarUrl: updatedUser.avatar,
    phone: updatedUser.phone,
    token: generateToken(updatedUser._id),
    message: "Profile picture updated successfully",
  });
});

`;

  return code.slice(0, start) + replacement + code.slice(end);
});

patch("server/server.js", (code) => {
  if (!code.includes('app.use("/uploads", express.static')) {
    if (!code.includes('import path from "path";')) {
      code = code.replace(/(import .+;\n)/, `$1import path from "path";\nimport { fileURLToPath } from "url";\n`);
    }

    if (!code.includes("__dirname")) {
      code = code.replace(
        "const app = express();",
        `const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);`
      );
    }

    code = code.replace(
      "app.use(express.urlencoded({ extended: false }));",
      `app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));`
    );
  }

  return code;
});

patch("src/features/Auth/AuthSlice.js", (code) => {
  const uploadStart = code.indexOf("export const uploadAvatar = createAsyncThunk(");
  const uploadEnd = code.indexOf("\n\nexport const changePassword", uploadStart);

  if (uploadStart !== -1 && uploadEnd !== -1) {
    const uploadBlock = `export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData, thunkAPI) => {
    try {
      const stateUser = thunkAPI.getState().auth.user;
      const localUser = JSON.parse(localStorage.getItem("user") || "null");
      const token = stateUser?.token || localUser?.token;

      if (!token) {
        return thunkAPI.rejectWithValue("Login again. Token missing.");
      }

      const response = await axios.post(API_URL + "upload-avatar", formData, {
        headers: {
          Authorization: \`Bearer \${token}\`,
        },
      });

      const updatedUser = {
        ...(stateUser || localUser || {}),
        ...response.data,
        avatar: response.data.avatar || response.data.avatarUrl,
        token: response.data.token || token,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);`;

    code = code.slice(0, uploadStart) + uploadBlock + code.slice(uploadEnd);
  }

  const reducerStart = code.indexOf("      // Upload Avatar");
  const reducerEnd = code.indexOf("      // Change Password", reducerStart);

  if (reducerStart !== -1 && reducerEnd !== -1) {
    const reducerBlock = `      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        state.message = action.payload.message || "Avatar uploaded successfully";
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
`;

    code = code.slice(0, reducerStart) + reducerBlock + code.slice(reducerEnd);
  }

  return code;
});

console.log("✅ Avatar upload token + backend response fixed.");
