import { useEffect, useState } from "react";
import {
    getDoctorDashboard,
    getPendingAppointments,
    getUpcomingAppointments,
    getCompletedAppointments,
    acceptAppointment,
    rejectAppointment,
    completeAppointment,
} from "../api/doctorApi";
import AppointmentCard from "../components/doctor/AppointmentCard";
function DoctorDashboard() {

    const [stats, setStats] = useState({});
    const [tab, setTab] = useState("pending");
    const [appointments, setAppointments] = useState([]);

    /* ================= FETCH ================= */

    const fetchStats = async () => {
        const res = await getDoctorDashboard();
        setStats(res.stats);
    };

    const fetchAppointments = async () => {
        let res;

        if (tab === "pending") {
            res = await getPendingAppointments();
        } else if (tab === "upcoming") {
            res = await getUpcomingAppointments();
        } else {
            res = await getCompletedAppointments();
        }

        setAppointments(res.appointments || []);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [tab]);

    /* ================= ACTIONS ================= */

    const handleAccept = async (id) => {
        await acceptAppointment(id);
        fetchAppointments();
    };

    const handleReject = async (id) => {
        await rejectAppointment(id);
        fetchAppointments();
    };

    const handleComplete = async (id) => {
        await completeAppointment(id);
        fetchAppointments();
    };

    return (

        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">

            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    Doctor Dashboard
                </h1>

                {/* ================= STATS ================= */}

                <div className="grid md:grid-cols-4 gap-6 mb-10">

                    <div className="p-5 bg-white dark:bg-slate-800  dark:text-amber-50 rounded-xl shadow">
                        <p>Total</p>
                        <h2 className="text-2xl font-bold">{stats.totalAppointments}</h2>
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-800  dark:text-amber-50 rounded-xl shadow">
                        <p>Pending</p>
                        <h2 className="text-2xl font-bold">{stats.pendingRequests}</h2>
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-800  dark:text-amber-50 rounded-xl shadow">
                        <p>Upcoming</p>
                        <h2 className="text-2xl font-bold">{stats.upcomingAppointments}</h2>
                    </div>

                    <div className="p-5 bg-white dark:bg-slate-800 dark:text-amber-50 rounded-xl shadow">
                        <p>Completed</p>
                        <h2 className="text-2xl font-bold">{stats.completedAppointments}</h2>
                    </div>

                </div>

                {/* ================= TABS ================= */}

                <div className="flex gap-3 mb-8 bg-white dark:bg-slate-800 p-2 rounded-xl shadow w-fit">

                    {["pending", "upcoming", "completed"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-lg capitalize transition ${tab === t
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {t}
                        </button>
                    ))}

                </div>
                {/* ================= APPOINTMENTS ================= */}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {appointments.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">
                            No appointments found
                        </p>
                    )}

                    {appointments.map((appt) => (
                        <AppointmentCard
                            key={appt._id}
                            appt={appt}
                            tab={tab}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            onComplete={handleComplete}
                        />
                    ))}

                </div>

            </div>

        </div>

    );
}

export default DoctorDashboard;