import { useEffect, useState } from "react";
import { searchDoctors } from "../../api/doctorApi";
import DoctorCard from "../doctor/DoctorCard";

function TopDoctors() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDoctors = async () => {
      try {

        const data = await searchDoctors({
  page: 1,
  limit: 8
});

console.log("Doctors API Response:", data);

        setDoctors(data.doctors || []);

      } catch (error) {

        console.error("Error fetching doctors", error);

      } finally {

        setLoading(false);

      }
    };

    fetchDoctors();

  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10">
          Top Rated Doctors
        </h2>

        <p className="text-gray-600 dark:text-gray-300">
          Loading doctors...
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10">
        Top Rated Doctors
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
          />
        ))}

      </div>

    </section>
  );
}

export default TopDoctors;