import { FaWifi, FaCoffee, FaDumbbell, FaWineGlassAlt } from 'react-icons/fa';
import SectionHeader from '../../Shared-file/SectionHeader';
import { BiCctv } from 'react-icons/bi';
import { GiPillow } from 'react-icons/gi';

const amenities = [
    { id: 1, icon: <BiCctv />, name: 'CCTV' },
    { id: 2, icon: <FaWifi />, name: 'Free Wifi' },
    { id: 3, icon: <FaCoffee />, name: 'Cafe' },
    { id: 4, icon: <FaDumbbell />, name: 'Gym' },
    { id: 5, icon: <GiPillow />, name: 'Pillow' },
    { id: 6, icon: <FaWineGlassAlt />, name: 'Glass' },
];

const AmenitiesCard = () => {
    return (
        <div className='max-w-[1320px] mx-auto mt-10 lg:-mt-8'>
                <SectionHeader
                heading="Our Amenities"
                description="Enjoy a comfortable stay with free Wi-Fi, a fully-equipped fitness center, and a refreshing outdoor pool. Our 24/7 customer support ensures you're always taken care of, and start your day right with a complimentary breakfast. We also offer pet-friendly accommodations and modern conference rooms for business needs"
            />
            <div className="flex flex-wrap gap-6 justify-center items-center  mt-10">
                {amenities.map((amenity) => (
                    <div
                        key={amenity.id}
                        className="flex flex-col items-center justify-center p-4 border w-48 bg-[#e0d7d1] text-primary hover:text-white hover:bg-primary rounded-lg shadow-md hover:scale-105 transition"
                    >
                        <div className="text-4xl  mb-2">
                            {amenity.icon}
                        </div>
                        <p className="text-lg font-medium">{amenity.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AmenitiesCard;
