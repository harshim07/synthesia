import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ResetPassword from "./components/auth/ResetPassword";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
// import Register from "./pages/Register";
import { clearError, logout, setError } from "./redux/slices/authSlice";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "./redux/slices/authSlice";
import axios from "axios";
import { setUser } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (!storedToken || user?._id) return;

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );

        dispatch(setUser({ user: res.data, token: storedToken }));
      } catch (error) {
        console.error("getMe failed", error);
        dispatch(logout());
        dispatch(
          setError(
            error?.response?.data?.message ||
              "Session expired. Please login again",
          ),
        );
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
