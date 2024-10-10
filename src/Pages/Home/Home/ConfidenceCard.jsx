
import { FaCheckCircle, FaShieldAlt, FaThumbsUp, FaStar } from 'react-icons/fa'; // Example icons from react-icons
import SectionHeader from '../../Shared-file/SectionHeader';

// Confidence Card Data
const cardData = [
    {
        id: 1,
        icon: <FaCheckCircle size={40} className="text-blue-500" />,
        title: 'Reliability',
        description: 'Our services are built on trust and dependability. You can rely on us to deliver consistent quality and support at every step of your journey.',
    },
    {
        id: 2,
        icon: <FaShieldAlt size={40} className="text-green-500" />,
        title: 'Security',
        description: 'We prioritize your safety with robust security measures. Your data is protected with state-of-the-art encryption and compliance with industry standards.',
    },
    {
        id: 3,
        icon: <FaThumbsUp size={40} className="text-yellow-500" />,
        title: 'Satisfaction',
        description: 'Customer satisfaction is our ultimate goal. We strive to exceed your expectations, ensuring you have a seamless experience from start to finish.',
    },
    {
        id: 4,
        icon: <FaStar size={40} className="text-red-500" />,
        title: 'Excellence',
        description: 'We are committed to excellence in everything we do. Our dedicated team works tirelessly to provide exceptional services and continuous improvement.',
    },
];

const ConfidenceCard = () => {
    return (
        <div className='max-w-[1320px] mx-auto mt-16'>
            <SectionHeader
                heading="Plan Your Travel With Confidence"
                description="Plan your travel with confidence by defining your destination and budget, researching local attractions, and booking flights and accommodations early. Create a flexible itinerary to ensure a memorable and stress-free experience. Enjoy the journey and embrace new adventures!"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                {cardData.map((card) => (
                    <div
                        key={card.id}
                        className="bg-white shadow-lg border-t-2 mt-10 hover:bg-primary group hover:scale-105 translate-y-5 rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="mb-4 group-hover:text-white px-6 py-5 bg-primary rounded-full w-20 group-hover:bg-white  mx-auto flex justify-center">{card.icon}</div>
                        <h3 className="text-xl group-hover:text-white font-bold mb-2">{card.title}</h3>
                        <p className="text-gray-600 group-hover:text-white">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConfidenceCard;
