import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchDoctors, getDoctorReviews } from "../api/doctorApi";

function DoctorProfile() {

  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  /* ================= FETCH DOCTOR ================= */

  const fetchDoctor = async () => {
    const data = await searchDoctors();
    const found = data.doctors.find((d) => d._id === id);
    setDoctor(found);
  };

  /* ================= FETCH REVIEWS ================= */

  const fetchReviews = async (userId) => {
    try {

      const res = await getDoctorReviews(userId);

      console.log("Reviews:", res);

      setReviews(res.reviews || []);
      setAvgRating(res.averageRating || 0);
      setTotalReviews(res.totalReviews || 0);

    } catch (error) {
      console.error("Review fetch error", error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (doctor?.user?._id) {
      fetchReviews(doctor.user._id); // ✅ CORRECT ID
    }
  }, [doctor]);

  /* ================= UI ================= */

  if (!doctor) {
    return <div className="p-10">Loading...</div>;
  }

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* HERO */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-8 grid md:grid-cols-3 gap-6">

          <img
            src={doctor.profileImage}
            className="w-36 h-36 rounded-xl object-cover"
          />

          <div className="md:col-span-2">

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {doctor.user.name}
            </h1>

            <p className="text-blue-600">{doctor.specialization}</p>

            <p className="mt-2 text-yellow-500">
              ⭐ {avgRating.toFixed(1)} ({totalReviews})
            </p>

            <p className="mt-2">📍 {doctor.region}</p>

            <p>🩺 {doctor.experience} yrs experience</p>

            <p className="font-semibold mt-2">
              ₹{doctor.consultationFee}
            </p>

            <Link
              to={`/book/${doctor.user._id}`}
              className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Book Appointment
            </Link>

          </div>

        </div>

        {/* REVIEWS */}
        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Reviews
          </h2>

          {reviews.length === 0 && (
            <p>No reviews yet</p>
          )}

          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg mb-3 shadow"
            >

              <p className="font-semibold">
                {r.patient?.name}
              </p>

              <p className="text-yellow-500">⭐ {r.rating}</p>

              <p>{r.comment}</p>

            </div>
          ))}

        </div>

      </div>

    </div>

  );
}

export default DoctorProfile;