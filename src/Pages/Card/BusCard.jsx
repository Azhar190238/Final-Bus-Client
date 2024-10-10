/* eslint-disable react/prop-types */
import { LuBus } from "react-icons/lu";
import { TbArmchair } from "react-icons/tb";
import { TbCoinTakaFilled } from "react-icons/tb";
import SectionHeader from "../Shared-file/SectionHeader";


const BusCard = ({heading, description, availableSeat, route, departureTime, estimateTime, startingPoint, ticketPrice}) => {
    return (
        <section className="">
           <SectionHeader heading={heading} description={description}/>
            <div className="section-gap flex flex-col items-center md:flex-row space-x-0 md:space-x-24">
                <div className=" w-full md:w-[75%]">
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
                            <p className="description">Route</p>
                            <p className="description !text-[#030712] !text-right">{route}</p>
                        </div>
                        <div className=" py-6 flex items-center justify-between border-b border-dashed border-[#03071233]">
                            <p className="description">Departure Time</p>
                            <p className="description !text-[#030712] !text-right">{departureTime}</p>
                        </div>
                        <div className="py-6 flex items-center justify-between flex-col md:flex-row">
                            <p className="description !text-center bg-[#0307120D] w-full md:!w-1/4 px-3 py-4 rounded-xl">Starting Point -  {startingPoint}</p>
                            <p className="description mt-6 md:mt-0 !text-center bg-[#0307120D] w-full md:!w-1/4 px-3 py-4 rounded-xl">Est. Time {estimateTime}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-[25%] border-none md:border-dashed border-primary border-l-[3px] py-0 md:py-28">
                    <div className="text-[#E67529] bg-[#E675291A] md:bg-white mt-6 md:mt-0 rounded-2xl py-5 md:py-0">
                        <TbCoinTakaFilled className="text-primary text-5xl text-center mx-auto" />
                        <p className="text-center mt-3 heading2 !text-primary md:!text-black">{ticketPrice} Taka</p>
                        <p className="text-center mt-2 !text-primary md:!text-black">Per Ticket</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusCard;