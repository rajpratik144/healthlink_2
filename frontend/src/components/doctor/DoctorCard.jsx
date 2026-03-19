import { Link } from "react-router-dom";
import { Star, MapPin, Stethoscope } from "lucide-react";

function DoctorCard({ doctor }) {

  const name = doctor.user?.name || "Doctor";

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition flex flex-col">

      {/* Doctor Image */}
      <img
        src={doctor.profileImage || "https://via.placeholder.com/300"}
        alt={name}
        className="w-full h-48 object-cover rounded-xl"
      />

      {/* Doctor Info */}
      <div className="mt-4 flex-1">

        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </h3>

        <p className="text-blue-600 font-medium">
          {doctor.specialization}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2 text-yellow-500">
          <Star size={16} />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {doctor.averageRating?.toFixed(1) || "0"} ({doctor.totalReviews || 0})
          </span>
        </div>

        {/* Region */}
        <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-300">
          <MapPin size={16} />
          <span>{doctor.region}</span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-300">
          <Stethoscope size={16} />
          <span>{doctor.experience} yrs experience</span>
        </div>

        {/* Fee */}
        <p className="mt-3 font-semibold text-gray-900 dark:text-gray-100">
          ₹{doctor.consultationFee}
        </p>

      </div>

      {/* Button */}
      <Link
        to={`/doctor/${doctor._id}`}
        className="mt-4 text-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Book Appointment
      </Link>

    </div>
  );
}

export default DoctorCard;