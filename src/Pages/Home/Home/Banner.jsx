import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Keyboard, Pagination, Navigation, Autoplay } from 'swiper/modules';

const slidesData = [
    {
        id: 1,
        image: '/src/assets/banner/banner1.png',
        title: 'End-to-End Travel with BRTC Paribahan',
        description: 'BRTC Paribahan provides safe and affordable bus services across Bangladesh, connecting major cities with modern, comfortable buses. Our dedicated team ensures a seamless travel experience, making your journey hassle-free. Book your tickets today!',
    },
    {
        id: 2,
        image: '/src/assets/banner/banner2.png',
        title: 'Explore New Destinations with BRTC Paribahan',
        description: 'Discover beautiful places and enjoy a comfortable journey with our reliable bus services. Your adventure awaits!',
    },
    {
        id: 3,
        image: '/src/assets/banner/banner3.png',
        title: 'End-to-End Travel with BRTC Paribahan',
        description: 'BRTC Paribahan provides safe and affordable bus services across Bangladesh, connecting major cities with modern, comfortable buses. Our dedicated team ensures a seamless travel experience, making your journey hassle-free. Book your tickets today!',
    },
    {
        id: 4,
        image: '/src/assets/banner/banner4.png',
        title: 'Explore New Destinations with BRTC Paribahan',
        description: 'Discover beautiful places and enjoy a comfortable journey with our reliable bus services. Your adventure awaits!',
    },

];

export default function Banner() {
    return (
        <div className='max-w-[1320px] mx-auto mt-28 h-full slider111'>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                keyboard={{
                    enabled: true,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                autoplay={{
                    delay: 3000, // Time in milliseconds between slides
                    disableOnInteraction: false,
                }}
                modules={[Keyboard, Pagination, Navigation, Autoplay]} // Include Autoplay module
                className="mySwiper"
            >
                {slidesData.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="relative max-w-[1320px] mx-auto h-screen bg-cover bg-center rounded-lg overflow-hidden"
                            style={{ backgroundImage: `url('${slide.image}')` }}
                        >
                            <div
                                className="absolute inset-0 opacity-80"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) 100%, rgba(0, 0, 0, 0) 0%)'
                                }}
                            ></div>

                            <div className="flex items-center justify-center h-full relative z-10">
                                <div className="text-center mx-auto text-white p-6">
                                    <h1 className="text-3xl mx-auto max-w-[700px] md:text-6xl font-bold mb-4 md:leading-[140%]">
                                        {slide.title}
                                    </h1>
                                    <p className="para1 !text-white mb-6 max-w-[700px]">
                                        {slide.description}
                                    </p>
                                    <button className="border-2 border-primary animate-pulse-scale px-4 md:px-8 py-4 rounded-[4px] bg-[#E67529] hover:text-white transition">
                                        Buy Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
