import { useEffect, useState } from 'react';
import ServiceCard from '../../Card/ServiceCard';
import SectionHeader from '../../Shared-file/SectionHeader';
import { FaBusAlt } from 'react-icons/fa';

const LatestService = () => {
    const [serviceData, setServiceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await fetch('https://api.koyrabrtc.com/buses'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setServiceData(data);
            } catch (err) {
                console.error('Error fetching service data:', err);
                setError('Failed to load services.');
            } finally {
                setLoading(false);
            }
        };

        fetchServiceData();
    }, []);

  
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

    if (error) {
        return <div>{error}</div>; // Handle any errors that occurred during fetching
    }

    return (
        <section className='bus-container'>
            <SectionHeader
                heading="BRTC Bus Service"
                description="BRTC Paribahan delivers reliable bus services with a focus on comfort and safety, ensuring seamless travel to your destinations"
            />
            <div className='section-gap'>
                {serviceData.length === 2 ? (
                    <div className='flex flex-col md:flex-row w-full gap-10'>
                        {serviceData.map((service) => (
                            <ServiceCard
                                key={service._id}
                                startTime={service.startTime}
                                totalSeat={service.totalSeats}
                                img={service.imageUrl}
                                _id={service._id}
                                busName={service.busName}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-20 w-full gap-8'>
                        {serviceData.map((service) => (
                            <ServiceCard
                                key={service._id}
                                startTime={service.startTime}
                                totalSeat={service.totalSeats}
                                img={service.imageUrl}
                                _id={service._id}
                                busName={service.busName}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LatestService;
