import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAvailableSlots, bookAppointment } from "../api/appointmentApi";

function BookAppointment() {

  const { doctorId } = useParams();

  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= DATE GENERATOR ================= */

  const getNext7Days = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      days.push({
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
      });
    }

    return days;
  };

  const dates = getNext7Days();

  /* ================= FETCH SLOTS ================= */

  const fetchSlots = async (date) => {
    try {
      setLoading(true);
      setSelectedDate(date);
      setSelectedSlot(null);

      const res = await getAvailableSlots(doctorId, date);
      setSlots(res.slots || []);

    } catch (error) {
      console.error("Slot fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= BOOK ================= */

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      alert("Please select date and time");
      return;
    }

    try {
      await bookAppointment({
        doctorId,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
      });

      alert("Appointment booked successfully");

      setSelectedSlot(null);

    } catch (error) {
      alert("Booking failed");
    }
  };

  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16 px-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
          Book Appointment
        </h1>

        {/* ================= DATE SELECT ================= */}

        <div className="mb-10">

          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Select Date
          </h2>

          <div className="flex gap-3 overflow-x-auto">

            {dates.map((d) => (
              <button
                key={d.date}
                onClick={() => fetchSlots(d.date)}
                className={`px-4 py-3 rounded-xl min-w-25 text-center transition 
                  ${selectedDate === d.date
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
              >
                {d.label}
              </button>
            ))}

          </div>

        </div>

        {/* ================= SLOTS ================= */}

        <div>

          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Available Slots
          </h2>

          {loading && (
            <p className="text-gray-500">Loading slots...</p>
          )}

          {!loading && selectedDate && slots.length === 0 && (
            <p className="text-gray-500">No slots available</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {slots.map((slot) => (

              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-3 rounded-xl border transition 
                  ${selectedSlot === slot
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
              >
                {slot}
              </button>

            ))}

          </div>

        </div>

        {/* ================= SUMMARY ================= */}

        {selectedDate && selectedSlot && (

          <div className="mt-10 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">

            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Appointment Summary
            </h3>

            <p className="text-gray-700 dark:text-gray-300">
              📅 {selectedDate}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              ⏰ {selectedSlot}
            </p>

            <button
              onClick={handleBooking}
              className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Confirm Booking
            </button>

          </div>

        )}

      </div>

    </div>

  );
}

export default BookAppointment;