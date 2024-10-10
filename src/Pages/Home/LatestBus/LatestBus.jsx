import { useState, useEffect } from "react";
import { LuBus } from "react-icons/lu";
import { TbArmchair } from "react-icons/tb";
import { TbCoinTakaFilled } from "react-icons/tb";
import SectionHeader from "../../Shared-file/SectionHeader";
import axios from "axios";

const LatestBus = () => {
    const [busData, setBusData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allocatedSeats, setAllocatedSeats] = useState([]);


    // Function to convert time string to Date object
    const parseTimeStringToDate = (timeString) => {
        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours < 12) {
            hours += 12; // Convert to 24-hour format
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0; // Midnight case
        }

        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return date;
    };

    useEffect(() => {
        const fetchBusData = async () => {
            try {
                const response = await fetch("http://localhost:5000/buses"); // Replace with your API endpoint
                if (!response.ok) {
                    const errorText = await response.text(); // Get the response text for debugging
                    throw new Error(`Network response was not ok: ${errorText}`);
                }
                const data = await response.json();
                const currentTime = new Date();
                const upcomingBuses = data.filter(bus => {
                    const busDepartureTime = parseTimeStringToDate(bus.startTime);
                    console.log(`Bus: ${bus.startTime}, Departure Time: ${busDepartureTime}`);
                    return busDepartureTime >= currentTime;
                });

                upcomingBuses.sort((a, b) => parseTimeStringToDate(a.startTime) - parseTimeStringToDate(b.startTime));

                setBusData(upcomingBuses[0] || null);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBusData();
    }, []);
    const busName = busData?.busName;
    console.log('Latest Bus', busName)

    useEffect(() => {
        const fetchPaidSeats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/allocated-seats/${busName}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Add Authorization header
                    },
                });

                // Check if the response data is an array
                if (Array.isArray(response.data)) {
                    const seats = response.data.map(item => item.allocatedSeat).flat(); // Extract and flatten seat arrays
                    setAllocatedSeats(seats);
                } else {
                    setError('Unexpected response format.');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching paid seats:', error); // Log error details
                setError('Failed to load allocated seats.');
                setLoading(false);
            }
        };

        fetchPaidSeats();
    }, [busName]);
    const totalSeat = busData?.totalSeats;
    console.log('Total seat', totalSeat)

    const availableSeat = totalSeat - allocatedSeats.length;
    console.log('SEAT=', allocatedSeats.length)

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!busData) {
        return <div className="text-3xl text-primary flex justify-center items-center mt-40">No upcoming buses available.</div>;
    }

    console.log(busData)

    return (
        <section className="bus-container">
            <SectionHeader
                heading="Latest Bus Service"
                description="The latest bus offers comfortable seating, air conditioning, and Wi-Fi, ensuring a smooth ride with daily departures for all travelers!"
            />
            <div className="section-gap flex flex-col items-center md:flex-row space-x-0 md:space-x-24">
                <div className="w-full md:w-[75%]">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex space-x-4 justify-center items-center heading2">
                            <LuBus />
                            <p>{busData.busName}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-4 justify-center items-center heading2 p-3 rounded-lg !text-[#E67529] bg-[#E675291A]">
                            <TbArmchair />
                            <p>{availableSeat} Seat Available</p>
                        </div>
                    </div>
                    <div className="bg-[#F7F8F8] rounded-2xl mt-10 px-8">
                        <div className="py-6 flex items-center justify-between border-b border-dashed border-[#03071233]">
                            <p className="description">Route</p>
                            <p className="description !text-[#030712] !text-right">{busData.startingPoint} - {busData.endingPoint}</p>
                        </div>
                        <div className="py-6 flex items-center justify-between border-b border-dashed border-[#03071233]">
                            <p className="description">Departure Time</p>
                            <p className="description !text-[#030712] !text-right">{busData.startTime}</p>
                        </div>
                        <div className="py-6 flex items-center justify-between flex-col md:flex-row">
                            <p className="description !text-center bg-[#0307120D] w-full md:!w-1/4 px-3 py-4 rounded-xl">Starting Point - {busData.startingPoint}</p>
                            <p className="description mt-6 md:mt-0 !text-center bg-[#0307120D] w-full md:!w-1/4 px-3 py-4 rounded-xl">Est. Time - {busData.estimatedTime} Hours</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[25%] border-none md:border-dashed border-primary border-l-[3px] py-0 md:py-28">
                    <div className="text-[#E67529] bg-[#E675291A] md:bg-white mt-6 md:mt-0 rounded-2xl py-5 md:py-0">
                        <TbCoinTakaFilled className="text-primary text-5xl text-center mx-auto" />
                        <p className="text-center mt-3 heading2 !text-primary md:!text-black">900 Taka</p>
                        <p className="text-center mt-2 !text-primary md:!text-black">Per Ticket</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestBus;
