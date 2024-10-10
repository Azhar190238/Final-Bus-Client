const statisticsData = [
    {
        id: 1,
        image: "/src/assets/statistics/people.png",
        value: "500K+",
        label: "Registered Users",
    },
    {
        id: 2,
        image: "/src/assets/statistics/stoppage.png",
        value: "1.7 lacks",
        label: "Tickets Sold",
    },
    {
        id: 3,
        image: "/src/assets/statistics/ticket-cupon.png",
        value: "800K+",
        label: "Rental Partners",
    },
];

const Statistics = () => {
    return (
        <div className="w-full md:max-w-[790px] mx-auto relative z-10 top-0  lg:-top-44">
            <div className="flex flex-wrap gap-3 md:gap-6 justify-center">
                {statisticsData.map((stat) => (
                    <div
                        key={stat.id}
                        className="flex items-center space-x-3 border-b-4 border-primary rounded-2xl shadow-2xl  bg-white p-3 md:p-6"
                    >
                        <img src={stat.image} alt={stat.label} className="flex items-center  w-8 md:w-16 h-8 md:h-16" />
                        <div className="flex flex-col justify-center space-y-2">
                            <h1 className="font-bold text-xl md:text-3xl">{stat.value}</h1>
                            <p className="text-[12px] md:text-md whitespace-pre">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;
