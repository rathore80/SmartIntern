import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setError("");

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("Login response:", response.data);

            const userData = response.data.user;
            const userToken = response.data.token;

            login(userData, userToken);

            if (userData.role === "student") {
                navigate("/student/dashboard");
            } else if (userData.role === "recruiter") {
                navigate("/recruiter/dashboard");
            } else if (userData.role === "admin") {
                navigate("/admin/dashboard");
            }

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to your SmartIntern account
                </p>

                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin}>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;