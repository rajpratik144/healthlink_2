import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function RegisterDoctor() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    medicalCertificateNumber: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      await API.post("/api/auth/register/doctor", form);

      alert("Doctor registered. Wait for admin approval.");

      navigate("/login");

    } catch (error) {

      alert("Registration failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Doctor Registration
        </h2>

        <input
          name="name"
          placeholder="Doctor Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-700 dark:text-white"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-700 dark:text-white"
          required
        />

        <input
          name="medicalCertificateNumber"
          placeholder="Medical Certificate Number"
          value={form.medicalCertificateNumber}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-700 dark:text-white"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg dark:bg-slate-700 dark:text-white"
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-lg dark:bg-slate-700 dark:text-white"
          required
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Register as Doctor
        </button>

      </form>

    </div>

  );

}

export default RegisterDoctor;