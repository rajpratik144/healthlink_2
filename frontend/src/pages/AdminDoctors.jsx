import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function AdminDoctors() {

  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {

      const res = await API.get("/api/admin/doctors/pending");

      console.log("Admin Response:", res.data);

      setDoctors(res.data.doctors || []);

    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    // 🔒 Only admin should fetch
    if (user?.role === "admin") {
      fetchDoctors();
    }

  }, [user]);

  const handleApprove = async (id) => {
    try {

      await API.patch(`/api/admin/doctors/${id}/approve`);

      fetchDoctors();

    } catch (error) {
      alert("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {

      await API.patch(`/api/admin/doctors/${id}/reject`);

      fetchDoctors();

    } catch (error) {
      alert("Rejection failed");
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-900 dark:to-slate-800 py-20 px-6">

      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
          Pending Doctor Approvals
        </h1>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500 dark:text-gray-400">
            Loading doctors...
          </p>
        )}

        {/* EMPTY */}
        {!loading && doctors.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No pending doctors
          </p>
        )}

        {/* DOCTOR CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          {doctors.map((doc) => (

            <div
              key={doc._id}
              className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg transition hover:scale-[1.02]"
            >

              {/* NAME */}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {doc.name}
              </h2>

              {/* EMAIL */}
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {doc.email}
              </p>

              {/* CERTIFICATE */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Certificate: {doc.medicalCertificateNumber}
              </p>

              {/* STATUS */}
              <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400">
                Pending Approval
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => handleApprove(doc._id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(doc._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default AdminDoctors;