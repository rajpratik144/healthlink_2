import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function DoctorCompleteProfile() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    specialization: "",
    experience: "",
    consultationFee: "",
    bio: "",
    clinicName: "",
    region: "",
    fullAddress: "",
    workingDays: [],
    startTime: "",
    endTime: "",
    slotDuration: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleDaysChange = (day) => {
    if (form.workingDays.includes(day)) {
      setForm({
        ...form,
        workingDays: form.workingDays.filter(d => d !== day)
      });
    } else {
      setForm({
        ...form,
        workingDays: [...form.workingDays, day]
      });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (key === "workingDays") {
          form.workingDays.forEach(day =>
            formData.append("workingDays", day)
          );
        } else {
          formData.append(key, form[key]);
        }
      });

      formData.append("profileImage", image);

      await API.post("/api/doctor/profile/complete", formData);

      alert("Profile completed successfully");

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Profile completion failed");
    }

  };

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const inputClass =
    "w-full p-3 rounded-lg border bg-white/50 dark:bg-slate-700/50 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none";

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-slate-900 dark:to-slate-950 py-20 px-6">

      <div className="max-w-4xl mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-10 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Complete Your Doctor Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* PROFILE IMAGE */}
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Profile Image
            </label>

            <input type="file" onChange={handleImage} required />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-4 w-24 h-24 rounded-full object-cover"
              />
            )}
          </div>

          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 gap-4">

            <input name="specialization" placeholder="Specialization" onChange={handleChange} className={inputClass} required />

            <input name="experience" placeholder="Experience (years)" onChange={handleChange} className={inputClass} required />

            <input name="consultationFee" placeholder="Consultation Fee (₹)" onChange={handleChange} className={inputClass} required />

            <input name="clinicName" placeholder="Clinic Name" onChange={handleChange} className={inputClass} required />

          </div>

          {/* BIO */}
          <textarea
            name="bio"
            placeholder="Write about yourself..."
            onChange={handleChange}
            className={inputClass}
            rows={3}
            required
          />

          {/* ADDRESS */}
          <div className="grid md:grid-cols-2 gap-4">

            <input name="region" placeholder="Region (City)" onChange={handleChange} className={inputClass} required />

            <input name="fullAddress" placeholder="Full Address" onChange={handleChange} className={inputClass} required />

          </div>

          {/* WORKING DAYS */}
          <div>
            <p className="mb-3 text-gray-700 dark:text-gray-300 font-medium">
              Working Days
            </p>

            <div className="flex flex-wrap gap-3">

              {days.map(day => (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDaysChange(day)}
                  className={`px-4 py-2 rounded-lg transition ${
                    form.workingDays.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}

            </div>
          </div>

          {/* TIMING */}
          <div className="grid md:grid-cols-3 gap-4">

            <input type="time" name="startTime" onChange={handleChange} className={inputClass} required />

            <input type="time" name="endTime" onChange={handleChange} className={inputClass} required />

            <select name="slotDuration" onChange={handleChange} className={inputClass} required>
              <option value="">Slot Duration</option>
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="45">45 mins</option>
            </select>

          </div>

          {/* SUBMIT */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg">
            Complete Profile
          </button>

        </form>

      </div>

    </div>

  );

}

export default DoctorCompleteProfile;