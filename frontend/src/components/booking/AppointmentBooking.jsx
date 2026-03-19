// import { useState, useEffect } from "react";
// import { getAvailableSlots, bookAppointment } from "../../api/appointmentApi";

// function AppointmentBooking({ doctorId }) {

//   const [date, setDate] = useState("");
//   const [slots, setSlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);

//   useEffect(() => {

//     if (date) fetchSlots();

//   }, [date]);

//   const fetchSlots = async () => {

//     try {

//       const data = await getAvailableSlots(doctorId, date);
//       setSlots(data.slots || []);

//     } catch (error) {

//       console.error("Slot fetch error", error);

//     }

//   };

//   const handleBooking = async () => {

//     try {

//       await bookAppointment({
//         doctorId,
//         appointmentDate: date,
//         timeSlot: selectedSlot
//       });

//       alert("Appointment booked successfully");

//     } catch (error) {

//       alert("Booking failed");

//     }

//   };

//   return (

//     <div className="mt-10">

//       {/* Date Picker */}

//       <input
//         type="date"
//         className="p-3 border rounded-lg"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//       />

//       {/* Slots */}

//       <div className="grid grid-cols-3 gap-4 mt-6">

//         {slots.map((slot) => {

//           const isBooked = !slot.available;

//           return (

//             <button
//               key={slot.time}
//               disabled={isBooked}
//               onClick={() => setSelectedSlot(slot.time)}
//               className={`p-3 rounded-lg text-white

//                 ${isBooked
//                   ? "bg-red-500 cursor-not-allowed"
//                   : selectedSlot === slot.time
//                     ? "bg-blue-600"
//                     : "bg-green-500"
//                 }
//               `}
//             >

//               {slot.time}

//             </button>

//           );

//         })}

//       </div>

//       {/* Confirm Button */}

//       {selectedSlot && (

//         <button
//           onClick={handleBooking}
//           className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
//         >
//           Confirm Appointment
//         </button>

//       )}

//     </div>

//   );

// }

// export default AppointmentBooking;