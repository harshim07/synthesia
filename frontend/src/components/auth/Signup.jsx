import React, { useState } from "react";
import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice";
import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import { CiUser } from "react-icons/ci";
import { MdPhotoCamera } from "react-icons/md";
import axios from "axios";
import "../../css/auth/Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //avatar states
  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Add file size validation
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      dispatch(setError("Image size should be less than 5MB"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };

    reader.onerror = () => {
      dispatch(setError("Failed to read image file"));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!name || !email || !password) {
      dispatch(setError("Please fill all fields"));
      return;
    }

    // Optional: Add password validation
    if (password.length < 6) {
      dispatch(setError("Password must be at least 6 characters"));
      return;
    }

    dispatch(setLoading(true));
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          name: name,
          email,
          password,
          avatar: base64Image || undefined,
        },
      );

      const data = res.data || {};
      dispatch(
        setUser({
          user: data.user,
          token: data.token,
        }),
      );

      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("Signup Successful");
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "Signup Failed. Please Try Again"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an account</h3>
      <p className="signup-subtitle">Join us today by entering the details</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div>
          <div className="profile-image-container">
            {previewImage ? (
              <img src={previewImage} alt="avatar" className="profile-image" />
            ) : (
              <div className="profile-placeholder">
                <CiUser size={40} />
              </div>
            )}
            <label className="image-upload-icon">
              <MdPhotoCamera size={12} color="white" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          <Input
            label={"Name"}
            type={"text"}
            name={"username"}
            placeholder={"Enter your name"}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Input
            label={"Email"}
            type={"email"}
            name={"email"}
            placeholder={"Enter your Email Id"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            label={"Password"}
            type={"password"}
            placeholder={"Enter your Password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <span
          className="forgot-link"
          onClick={() => {
            dispatch(clearError());
            dispatch(switchAuthMode("login"));
          }}
        >
          Do you already have an account?
        </span>

        {error && <div className="signup-error">{error}</div>}
        <div className="signup-actions">
          <button
            className="signup-btn-submit"
            disabled={isLoading}
            type="submit"
          >
            <span>{isLoading ? "Signing Up..." : "Signup"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
