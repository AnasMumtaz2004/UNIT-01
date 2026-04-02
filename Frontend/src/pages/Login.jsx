import { useState } from "react";
import { useNavigate } from "react-router-dom";


const API_URL = `${import.meta.env.VITE_API_URL}/auth`

function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setloading] = useState(false)
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        setError("");

        const endpoint = isRegister ? "/register" : "/login";

        const body = isRegister ? { name, email, password } : { email, password };

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Something went wrong");
                return;
            }

            // Save Token Info
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                id: data._id,
                name: data.name,
                email: data.email,
            }));

            navigate("/chat");
        } catch (err) {
            setError("Network error. Server not responding");
            console.log("Login fetch error:", err.message);
        } finally {
            setloading(false);
        }
    }
    return (
        <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* logo */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl">{'\u2726'}</span>
                    </div>
                    <h1 className="text-white text-3xl font-bold tracking-tight">UNIT-01</h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        {isRegister ? "Create your account" : "Welcome back"}
                    </p>
                </div>

                {/* Login form */}
                <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8">

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Name field — only shown during Register */}
                        {isRegister && (
                            <div>
                                <label className="text-gray-400 text-sm block mb-0.5">Name</label>
                                <input
                                    placeholder="Your Name"
                                    type="text"
                                    className="w-full bg-[#0f0f1a] text-white border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-gray-400 text-sm block mb-0.5">Email</label>
                            <input
                                placeholder="you@example.com"
                                type="email"
                                className="w-full bg-[#0f0f1a] text-white border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-sm block mb-0.5">Password</label>
                            <input
                                placeholder="Your Password"
                                type="password"
                                className="w-full bg-[#0f0f1a] text-white border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-gray-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 text-sm mt-2 transition-colors"
                        >
                            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
                        </button>
                    </form>

                    <p className="text-gray-400 text-sm mt-4 text-center">
                        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => { setIsRegister(!isRegister); setError(""); }}
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            {isRegister ? "Login" : "Register"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login