import{ useState } from 'react';

const Welcome = () => {
    const [activeTab, setActiveTab] = useState('mission');

    const descriptions = {
        mission: "Our mission is to deliver a seamless, user-friendly, and efficient bus ticketing experience. We strive to provide passengers with prompt access to bus schedules, ticket information, and booking services, ensuring their journey begins with ease and convenience. At the bus counter, we are committed to maintaining high standards of customer service by delivering accurate information and ensuring passengers feel supported throughout their ticketing process. Our goal is to create a stress-free and accessible environment where all travelers, whether regular commuters or first-time passengers, receive the help they need to embark on their journey confidently.",
        vision: "Our vision is to become the leading bus counter service provider, recognized for our excellence in customer service, technology integration, and operational efficiency. We aim to redefine the bus travel experience by continually innovating our services, offering quicker booking options, and incorporating advanced technology to reduce waiting times. By enhancing our ticketing processes and ensuring customer satisfaction at every touchpoint, we envision a future where bus travel becomes the most convenient, accessible, and preferred mode of transportation. Our ultimate goal is to be known not just as a bus counter, but as a key contributor to an efficient, sustainable, and traveler-centric transportation network.",
        values: "Our values are centered around providing excellent customer service, ensuring every passenger feels valued and supported. We prioritize efficiency by streamlining ticketing processes for quick and hassle-free transactions. Transparency is key; we offer clear and accurate information on ticket prices, schedules, and availability. We maintain reliability through dependable services and accurate information. Inclusivity is at the heart of our approach, making our services accessible to all passengers, including those with special needs. We embrace sustainability by promoting eco-friendly practices like e-ticketing, and we integrate technology to enhance convenience. Above all, we operate with integrity, maintaining trust and professionalism in everything we do."
    };
    const tabs = ['mission', 'vision', 'values'];

    return (
        <div className='mx-auto max-w-[1320px]'>
            <div className='flex flex-col lg:flex-row-reverse mx-8 md:mx-0 gap-24 '>
                <div className='w-full md:w-1/2 mt-28 bg-primary p-10 rounded-md '>
                    <div className='h-auto md:h-[650px]'>
                        <img src='/src/assets/about/admin.jpeg' alt="bg" className='h-auto md:h-[650px] rounded-md w-full' />
                    </div>
                </div>
                <div className='w-full md:w-1/2 flex flex-col justify-center items-center'>
                    <div>

                        <div className='mt-10'>
                            <h1 className='heading !text-left mb-10'>About Me</h1>
                            <p className='text-justify para1 mb-10'>
                               Hello, I am Azharuddin, a passionate web developer with a strong foundation in Computer Science and Engineering, having graduated from Khulna University. My journey in web development has been fueled by a deep curiosity for creating user-friendly, visually appealing, and efficient web applications. With expertise in HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB, I strive to deliver seamless and responsive web solutions.
                            </p>
                            <div className='space-x-6'>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[18px] capitalize font-bold duration-300 hover:scale-105 hover:border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'text-secondary'}`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <p className='text-justify mt-8'>{descriptions[activeTab]}</p>
                        </div>
                        <button className="mx-auto mt-[50px] rounded bg-[#E67529] shadow-custom-light text-[18px] capitalize duration-300 hover:scale-105 font-medium text-white px-8 py-4">
                            Service
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
