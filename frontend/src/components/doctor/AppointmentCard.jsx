function AppointmentCard({
  appt,
  tab,
  onAccept,
  onReject,
  onComplete,
}) {

  const statusColor = {
    pending: "bg-yellow-500",
    accepted: "bg-green-500",
    completed: "bg-blue-500",
    rejected: "bg-red-500",
  };

  return (

    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-lg transition">

      {/* PATIENT */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {appt.patient?.name}
      </h2>

      {/* INFO */}
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p>📅 {new Date(appt.appointmentDate).toLocaleDateString()}</p>
        <p>⏰ {appt.timeSlot}</p>
      </div>

      {/* STATUS */}
      <div className="mt-4">
        <span
          className={`text-white text-xs px-3 py-1 rounded-full ${statusColor[appt.status]}`}
        >
          {appt.status}
        </span>
      </div>

      {/* ACTIONS */}

      {tab === "pending" && (
        <div className="flex gap-3 mt-5">

          <button
            onClick={() => onAccept(appt._id)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() => onReject(appt._id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            Reject
          </button>

        </div>
      )}

      {tab === "upcoming" && (
        <button
          onClick={() => onComplete(appt._id)}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Mark Completed
        </button>
      )}

    </div>

  );
}

export default AppointmentCard;