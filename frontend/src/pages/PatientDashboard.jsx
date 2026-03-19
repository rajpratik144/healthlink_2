import { useEffect, useState } from "react";
import API from "../api/axios";
import { submitReview } from "../api/doctorApi";

function PatientDashboard() {

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  /* ================= FETCH ================= */

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/api/patient/appointments");
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error("Failed to load appointments", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ================= ACTIONS ================= */

  const handleCancel = async (id) => {
    try {
      await API.patch(`/api/appointments/${id}/cancel`);
      alert("Appointment cancelled");
      fetchAppointments();
    } catch (error) {
      alert("Cancel failed");
    }
  };

  const openReviewModal = (appt) => {
    setSelectedAppointment(appt);
  };

  const handleSubmitReview = async () => {
  try {

    await submitReview({
      appointmentId: selectedAppointment._id,
      rating,
      comment,
    });

    alert("Review submitted");

    // ✅ MARK AS REVIEWED (LOCAL UPDATE)
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === selectedAppointment._id
          ? { ...appt, reviewed: true }
          : appt
      )
    );

    setSelectedAppointment(null);
    setRating(5);
    setComment("");

  } catch (error) {
    alert("Failed to submit review");
  }
};

  /* ================= HELPERS ================= */

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-20 px-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
          My Appointments
        </h1>

        {appointments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No appointments yet
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-6">

          {appointments.map((appointment) => (

            <div
              key={appointment._id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow hover:shadow-lg transition p-6"
            >

              {/* DOCTOR INFO */}

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {appointment.doctor?.name}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {appointment.doctor?.email}
              </p>

              {/* DATE + TIME */}

              <div className="mt-4 space-y-1 text-gray-700 dark:text-gray-300">

                <p>📅 {formatDate(appointment.appointmentDate)}</p>
                <p>⏰ {appointment.timeSlot}</p>

              </div>

              {/* STATUS */}

              <div className="mt-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex flex-col gap-3">

                {appointment.status === "pending" && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel Appointment
                  </button>
                )}

                {appointment.status === "completed" && !appointment.reviewed &&(
                  <button
                    onClick={() => openReviewModal(appointment)}
                    className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Write Review
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= REVIEW MODAL ================= */}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Write Review
            </h2>

            {/* RATING */}
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full mb-4 p-2 border rounded dark:bg-slate-700 dark:text-white"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>

            {/* COMMENT */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full p-2 border rounded mb-4 dark:bg-slate-700 dark:text-white"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">

              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

    </div>

  );
}

export default PatientDashboard;