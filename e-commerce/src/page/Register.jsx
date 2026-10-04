import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../apiCalls/userApi";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex (RFC 5322 simplified)
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Get password strength feedback
  const getPasswordFeedback = (password) => {
    const feedback = [];
    if (password.length < 8) feedback.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) feedback.push("One uppercase letter");
    if (!/[a-z]/.test(password)) feedback.push("One lowercase letter");
    if (!/\d/.test(password)) feedback.push("One number");
    if (!/[@$!%*?&]/.test(password)) feedback.push("One special character (@$!%*?&)");
    return feedback;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation logic
    if (!user.username || user.username.trim() === "") {
      newErrors.username = "Name is required!";
    } else if (user.username.length < 3) {
      newErrors.username = "Name must be at least 3 characters!";
    }

    if (!user.email || user.email.trim() === "") {
      newErrors.email = "Email is required!";
    } else if (!validateEmail(user.email)) {
      newErrors.email = "Please enter a valid email address!";
    }

    if (!user.address || user.address.trim() === "") {
      newErrors.address = "Address is required!";
    }

    if (!user.password || user.password === "") {
      newErrors.password = "Password is required!";
    } else if (!validatePassword(user.password)) {
      const feedback = getPasswordFeedback(user.password);
      newErrors.password = `Password must include: ${feedback.join(", ")}`;
    }

    if (!user.confirmPassword || user.confirmPassword === "") {
      newErrors.confirmPassword = "Please confirm your password!";
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    // If there are errors, display them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // All validations passed
    setErrors({});
    setIsLoading(true);

    try {
      const response = await register(user);
      if (response.error) {
        Swal.fire({
          title: "Registration Error",
          html: response.error,
          icon: "error",
          timerProgressBar: true,
          timer: 3000,
        });
      } else {
        Swal.fire({
          title: "Registration Successful!",
          html: response.message || "Please check your email to verify your account.",
          icon: "success",
          timerProgressBar: true,
          timer: 3000,
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Unexpected Error",
        html: "Something went wrong. Please try again later.",
        icon: "error",
        timerProgressBar: true,
        timer: 3000,
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gray-100 px-6 py-12">
      {/* Logo at the top center */}
      <div className="text-center mb-6">
        <img src="/logo1.png" alt="Logo" className="w-32 h-32 mx-auto object-contain" />
      </div>

      {/* Main container */}
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
        {/* Left Form Section */}
        <div className="flex flex-col justify-center w-full md:w-[45%] p-8">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            Create an Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your full name"
                value={user.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={user.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                We'll send a verification link to this email.
              </p>
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={user.address}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a strong password"
                value={user.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              {user.password && !validatePassword(user.password) && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  <p className="font-semibold mb-1">Password must include:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {getPasswordFeedback(user.password).map((feedback, idx) => (
                      <li key={idx}>{feedback}</li>
                    ))}
                  </ul>
                </div>
              )}
              {user.password && validatePassword(user.password) && (
                <p className="text-green-600 text-xs mt-1">✓ Strong password</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={user.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
              {user.password &&
                user.confirmPassword &&
                user.password === user.confirmPassword && (
                  <p className="text-green-600 text-xs mt-1">✓ Passwords match</p>
                )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Right Image Section */}
        <div className="hidden md:flex w-full md:w-[55%] p-0 items-center justify-center bg-gray-50">
          <img
            src="/register1.png"
            alt="Register illustration"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
