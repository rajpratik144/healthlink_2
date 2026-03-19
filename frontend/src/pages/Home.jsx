import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Calendar, Star } from "lucide-react";
import TopDoctors from "../components/home/TopDoctors";


function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Find Trusted Doctors <br /> Near You
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            HealthLink helps you discover verified doctors,
            book appointments instantly, and manage your healthcare
            effortlessly.
          </p>

          <Link
            to="/find-doctors"
            className="inline-block mt-8 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Find Doctors
          </Link>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="hospital-service-concept-flat-illustration.png"
            alt="doctor illustration"
            className="w-full"
          />
        </motion.div>

      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Why Choose HealthLink
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">

          {/* Feature 1 */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">

            <ShieldCheck className="text-blue-600 w-10 h-10" />

            <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-gray-100">
              Verified Doctors
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Every doctor on HealthLink goes through a strict
              verification and approval process.
            </p>

          </div>

          {/* Feature 2 */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">

            <Calendar className="text-green-600 w-10 h-10" />

            <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-gray-100">
              Easy Appointment Booking
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Select your preferred date and time slot and confirm
              your appointment instantly.
            </p>

          </div>

          {/* Feature 3 */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">

            <Star className="text-yellow-500 w-10 h-10" />

            <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-gray-100">
              Trusted Reviews
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Patients can review doctors only after completing
              appointments ensuring authentic ratings.
            </p>

          </div>

        </div>

      </section>
      <TopDoctors />

    </div>
  );
}

export default Home;