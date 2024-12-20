import { useEffect, useState } from "react";
import { FaBus, FaBusAlt, FaUserAstronaut, FaUsers } from "react-icons/fa";
import { GiPoliceOfficerHead } from "react-icons/gi";

const AdminHome = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [mastersCount, setMastersCount] = useState(0);
  const [normalUsersCount, setNormalUsersCount] = useState(0);
  const [totalBuses, setTotalBuses] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming you have token stored in localStorage
    fetch("https://api.koyrabrtc.com/users", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    })
      .then((response) => {
        if (!response.ok) {
          // Handle unauthorized access
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        const allUsers = data.length;
        const masters = data.filter((user) => user.role === "master").length;
        const normalUsers = data.filter((user) => user.role === "member").length;

        setTotalUsers(allUsers);
        setMastersCount(masters);
        setNormalUsersCount(normalUsers);
      })
      .catch((error) => console.error("Error fetching users:", error))
      .finally(() => {
        setLoading(false); // Stop loading once data is fetched or if an error occurs
    });
  }, []);

  // Fetch total buses
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://api.koyrabrtc.com/buses", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch buses");
        }
        return response.json();
      })
      .then((data) => {
        setTotalBuses(data.length);
      })
      .catch((error) => console.error("Error fetching buses:", error));
  }, []);

  const dashboardItems = [
    {
      icon: FaUsers,
      count: totalUsers,
      text: "Total Number of All Users",
    },
    {
      icon: GiPoliceOfficerHead,
      count: mastersCount,
      text: "Number of Counter Masters",
    },
    {
      icon: FaUserAstronaut,
      count: normalUsersCount,
      text: "Total Number of Normal Users",
    },
    {
      icon: FaBus,
      count: totalBuses,
      text: "Total Number of Buses",
    },
  ];

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-4xl animate-spin">
                <FaBusAlt className="text-primary" />
            </div>
            <p className="ml-4 text-2xl text-gray-600">Loading...</p>
        </div>
    );
}
  return (
    <div className="mx-10 my-12">
      {/* Dashboard content */}
      <div className="flex flex-wrap gap-6">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-64 h-48 bg-purple-100 shadow-lg hover:scale-105 group rounded-lg transition-transform duration-200"
          >
            <item.icon className="text-6xl text-[#2b2b38] group-hover:text-primary" />
            <h1 className="text-[#2b2b38] group-hover:text-primary font-bold p-6 py-2 text-center">
              {item.text}: {item.count}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
