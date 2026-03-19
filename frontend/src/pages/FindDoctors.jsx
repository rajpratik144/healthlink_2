import { useEffect, useState } from "react";
import { searchDoctors } from "../api/doctorApi";
import DoctorCard from "../components/doctor/DoctorCard";

function FindDoctors() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    region: "",
    specialization: "",
    minRating: "",
    maxFee: "",
    page: 1,
    limit: 8
  });

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {

    setLoading(true);

    try {

      const data = await searchDoctors(filters);
      setDoctors(data.doctors || []);

    } catch (error) {

      console.error("Search error", error);

    } finally {

      setLoading(false);

    }
  };

  const handleChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });

  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Find Doctors
        </h1>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-10">

          <input
            name="specialization"
            placeholder="Specialization"
            value={filters.specialization}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          />

          <input
            name="region"
            placeholder="Region"
            value={filters.region}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          />

          <input
            name="minRating"
            placeholder="Min Rating"
            value={filters.minRating}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          />

          <input
            name="maxFee"
            placeholder="Max Fee"
            value={filters.maxFee}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          />

        </div>

        {/* Results */}

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">
            Searching doctors...
          </p>
        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default FindDoctors;