import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth(); // IMPORTANT

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const res = await login(form);

    alert("Login successful");

    const user = res.user;

    // REDIRECT LOGIC
    if (user.role === "doctor" && !user.profileCompleted) {
      navigate("/doctor/complete-profile");
    } else {
      navigate("/");
    }

  } catch (error) {

    alert("Login failed");

  }

};

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-700 dark:text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg dark:bg-slate-700 dark:text-white"
          required
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Login
        </button>

      </form>

    </div>

  );

}

export default Login;