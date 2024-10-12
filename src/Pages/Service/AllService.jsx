import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LuBus } from "react-icons/lu";
import { TbArmchair, TbCoinTakaFilled } from "react-icons/tb";
import SectionHeader from "../Shared-file/SectionHeader";
import Service from "../Service/Service";
import BasicHeader from "../Shared-file/BasicHeader";
import axios from "axios";

const AllService = () => {
    const { id } = useParams();
    const [serviceData, setServiceData] = useState(null);
    const [ticketPrice, setTicketPrice] = useState(0);
    const [allocatedSeats, setAllocatedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState("");

    // Fetch service data
    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/buses/${id}`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setServiceData(data);
            } catch (error) {
                console.error("Error fetching service data:", error);
                setError('Failed to load service data.');
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [id]);

    // Fetch allocated seats
    const busName = serviceData?.busName;
    useEffect(() => {
        const fetchPaidSeats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/allocated-seats/${busName}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (Array.isArray(response.data)) {
                    const seats = response.data.map(item => item.allocatedSeat).flat();
                    setAllocatedSeats(seats);
                } else {
                    setError('Unexpected response format.');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching paid seats:', error);
                setError('Failed to load allocated seats.');
                setLoading(false);
            }
        };

        fetchPaidSeats();
    }, [busName]);

    // Fetch routes matching the bus name and set default price
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/routes');
                const allRoutes = response.data;

                // Filter routes that match the current bus name
                const filteredRoutes = allRoutes.filter(route => route.busName === busName && route.routes && route.routes.length > 0);

                // Set routes and default ticket price if available
                if (filteredRoutes.length > 0) {
                    const busRoutes = filteredRoutes[0].routes;
                    setRoutes(busRoutes);

                    // Set default ticket price to the first route's price
                    if (busRoutes.length > 0) {
                        setTicketPrice(busRoutes[0].price);
                        setSelectedRoute(busRoutes[0].routeName); // Set the default selected route
                    }
                } else {
                    setRoutes([]);
                }
            } catch (error) {
                console.error('Error fetching routes:', error);
                setError('Failed to load routes.');
            }
        };

        if (busName) {
            fetchRoutes();
        }
    }, [busName]);

    // Handle route change and update ticket price
    const handleRouteChange = (e) => {
        const selectedRouteName = e.target.value;
        setSelectedRoute(selectedRouteName);

        // Find the price for the selected route
        const selectedRouteData = routes.find(route => route.routeName === selectedRouteName);
        if (selectedRouteData) {
            setTicketPrice(selectedRouteData.price); // Update the price based on the route
        }
    };

    // Handle loading and error states
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!serviceData) return <div>No service data available.</div>;

    const {
        heading = `Bus No: ${serviceData.busName}`,
        description = serviceData.description || 'The latest Koyra to Dhaka bus offers comfortable seating, air conditioning, and Wi-Fi, ensuring a smooth ride with daily departures for all travelers!',
        totalSeat = serviceData.totalSeats || 45,
        departureTime = serviceData.startTime || '9:00 AM',
        estimateTime = serviceData.estimatedTime || '11 Hours',
        startingPoint = serviceData.startingPoint || 'Koyra',
        endingPoint = serviceData.endingPoint || 'Dhaka'
    } = serviceData;

    const availableSeat = totalSeat - allocatedSeats.length;

    return (
        <section>
            <BasicHeader heading='Service' />
            <div className='pt-10'>
                <SectionHeader heading={heading} description={description} />
            </div>
            <div className="my-10 max-w-[1320px] mx-auto">
                <p className="text-center text-5xl">{allocatedSeats.length}</p>
                <p className="text-center text-5xl">{allocatedSeats.join(', ')}</p>
            </div>
            <div className="section-gap flex flex-col items-center md:flex-row space-x-0 md:space-x-24 bus-container">
                <div className="w-full md:w-[75%]">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex space-x-4 justify-center items-center heading2">
                            <LuBus />
                            <p>BRTC BUS</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-4 justify-center items-center heading2 p-3 rounded-lg !text-[#E67529] bg-[#E675291A]">
                            <TbArmchair />
                            <p>{availableSeat} Seat Available</p>
                        </div>
                    </div>
                    <div className="bg-[#F7F8F8] rounded-2xl mt-10 px-8">
                        <div className="py-6 flex items-center justify-between border-b border-dashed border-[#03071233]">
                            <p className="description">Select Route</p>

                            {routes.length > 0 ? (
                                <select
                                    className="custom-select !text-[#030712] !text-right p-2 border rounded-lg"
                                    value={selectedRoute}
                                    onChange={handleRouteChange}
                                >
                                    {routes.map((route, index) => (
                                        <option key={index} value={route.routeName}>
                                            {route.routeName}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>No routes available</p>
                            )}

                        </div>
                        <div className="py-6 flex items-center justify-between border-b border-dashed border-[#03071233]">
                            <p className="description">Starting Time</p>
                            <p className="description !text-[#030712] !text-right">{departureTime}</p>
                        </div>
                        <div className="py-6 flex items-center justify-between flex-col md:flex-row">
                            <p className="description !text-center bg-[#0307120D] w-full md:w-1/4 px-3 py-4 rounded-xl">
                                Starting Point - {startingPoint}
                            </p>
                            <p className="description mt-6 md:mt-0 !text-center bg-[#0307120D] w-full md:w-1/4 px-3 py-4 rounded-xl">
                                Est. Time {estimateTime}
                            </p>
                            <p className="description !text-center bg-[#0307120D] w-full md:w-1/4 px-3 py-4 rounded-xl">
                                Ending Point - {endingPoint}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[25%] border-none md:border-dashed border-primary border-l-[3px] py-0 md:py-28">
                    <div className="text-[#E67529] bg-[#E675291A] md:bg-white mt-6 md:mt-0 rounded-2xl py-5 md:py-0">
                        <TbCoinTakaFilled className="text-primary text-5xl text-center mx-auto" />
                        <p className="text-center mt-3 heading2 !text-primary md:!text-black">
                            {ticketPrice} Taka
                        </p>
                        <p className="text-center mt-2 !text-primary md:!text-black">
                            Per Ticket
                        </p>
                    </div>
                </div>
            </div>
            <Service seatPrice={ticketPrice} busName={busName} />
        </section>
    );
};

export default AllService;
