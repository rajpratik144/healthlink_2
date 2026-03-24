import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Calendar, Star } from "lucide-react";
import TopDoctors from "../components/home/TopDoctors";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold leading-tight text-gray-900 dark:text-white">
            Book Trusted Doctors <br /> Instantly
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            Discover verified doctors, read real patient reviews,
            and book appointments in seconds — all in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/find-doctors"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Find Doctors
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white"
            >
              Get Started
            </Link>
          </div>
        </motion.div>

        <motion.img
          src="hospital-service-concept-flat-illustration.png"
          className="w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        />

      </section>

      {/* ================= STATS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-6 text-center">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-600">500+</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Verified Doctors
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-green-600">10K+</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Appointments Booked
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-yellow-500">4.8⭐</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Average Rating
            </p>
          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Why Choose HealthLink
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow hover:shadow-lg">
            <ShieldCheck className="text-blue-600 w-10 h-10" />
            <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">
              Verified Doctors
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Every doctor is verified and approved before listing.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow hover:shadow-lg">
            <Calendar className="text-green-600 w-10 h-10" />
            <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">
              Easy Booking
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Book appointments in seconds with real-time slots.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow hover:shadow-lg">
            <Star className="text-yellow-500 w-10 h-10" />
            <h3 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">
              Trusted Reviews
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Only real patients can leave reviews.
            </p>
          </div>

        </div>

      </section>

      {/* ================= TOP DOCTORS ================= */}
      <TopDoctors />

      {/* ================= TESTIMONIALS ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          What Patients Say
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-6">

          {[
            {
              name: "Rohit Sharma",
              text: "Very smooth experience. Booking was quick and doctor was excellent.",
            },
            {
              name: "Priya Verma",
              text: "Loved the interface. Found a good doctor within minutes.",
            },
            {
              name: "Aman Gupta",
              text: "The review system is very helpful. Highly recommended!",
            },
          ].map((t, i) => (

            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow"
            >
              <p className="text-gray-700 dark:text-gray-300">
                "{t.text}"
              </p>

              <p className="mt-4 font-semibold text-gray-900 dark:text-white">
                — {t.name}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-200 py-16 text-center text-gray-800 dark:bg-gray-800 dark:text-amber-50">

        <h2 className="text-3xl font-bold text-gray-800 dark:text-amber-50">
          Ready to Book Your Appointment?
        </h2>

        <p className="mt-3 text-gray-800 dark:text-blue-100 ">
          Find the best doctors near you today.
        </p>

        <Link
          to="/find-doctors"
          className="inline-block mt-6 px-6 py-3 bg-white text-blue-600 rounded-xl font-medium"
        >
          Get Started
        </Link>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 py-10">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-xl font-bold text-white">
              HealthLink
            </h3>
            <p className="mt-3 text-sm">
              Connecting patients with trusted healthcare professionals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/find-doctors">Find Doctors</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Contact</h4>
            <p className="mt-3 text-sm">
              support@healthlink.com
            </p>
          </div>

        </div>

        <p className="text-center text-sm mt-8 text-gray-500">
          ©️ 2026 HealthLink. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;