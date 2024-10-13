// eslint-disable-next-line no-unused-vars
import React from 'react';
import logo from '../../../assets/logo.png'
import { FaFacebook, FaLinkedin, FaPhoneAlt, FaEnvelope, FaYoutube } from 'react-icons/fa';
import { FiPhoneCall } from 'react-icons/fi';
import { IoHomeOutline } from "react-icons/io5";
import { LuMailCheck } from 'react-icons/lu';

const Footer = () => {
    return (
        <footer className=" py-10 mt-20">
            <div className="max-w-[1320px] px-8 md:px-0 mx-auto text-[#534C4C] font-poppins">
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20'>
                    <div className='w-full'>
                        <div className="flex items-center">
                            <img className=' mx-auto rounded-full w-32 h-32 border' src={logo} alt='logo'  />
                        </div>
                        <p className='mt-[10px]  font-normal text-[16px] text-center text-[#2B2B2B]'>A straightforward platform for seamless bus ticket booking</p>
                        <div className="flex justify-center gap-6 mt-[20px] w-full">
                            <a href="#" className="text-black hover:text-[#E67529]">
                                <FaYoutube size={20} />
                            </a>
                            <a href="#" className="text-black hover:text-[#E67529]">
                                <FaFacebook size={20} />
                            </a>
                            <a href="" className="text-black hover:text-[#E67529]">
                                <FaEnvelope size={20} />
                            </a>
                            <a href="tel:+1234567890" className="text-black hover:text-[#E67529]">
                                <FaPhoneAlt size={20} />
                            </a>
                            <a href="#" className="text-black hover:text-[#E67529]">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div className='mx-auto'>
                        <h3 className="text-[16px] font-bold flex items-center gap-2">
                            <p className='w-3 h-3 rounded-full bg-[#E67529]'></p>
                            <p>Quick Links</p>
                        </h3>
                        <ul className="mt-7 space-y-4">
                            <li><a href="#" className="">Home</a></li>
                            <li><a href="#" className="">Services</a></li>
                            <li><a href="#" className="">About</a></li>
                            <li><a href="#" className="">Shop</a></li>
                            <li><a href="#" className="">Blog</a></li>
                        </ul>
                    </div>
                    <div className='mx-auto'>
                        <h3 className="text-[16px] font-bold flex items-center gap-2">
                            <p className='w-3 h-3 rounded-full bg-[#E67529]'></p>
                            <p>Support</p>
                        </h3>
                        <ul className="mt-7 space-y-4">
                            <li><a href="/contact" className="">Contact Us</a></li>
                            <li><a href="/faq" className="">FAQS</a></li>
                            <li><a href="#" className="">Privacy Policy</a></li>
                            <li><a href="#" className="">Terms & Condition</a></li>
                        </ul>
                    </div>
                    <div className='mx-auto'>
                        <h3 className="text-[16px] font-bold flex items-center gap-2">
                            <p className='w-3 h-3 rounded-full bg-[#E67529]'></p>
                            <p>Contact</p>
                        </h3>
                        <ul className="mt-7 space-y-4">
                            <div className='space-y-3'>
                                <p className='flex'> <span><IoHomeOutline className='text-xl text-primary mr-2 mt-1' /> </span> 50 Outer Bypass Road, Sonadanga , Khulna 9001. Bangladesh</p>
                                <p className='flex'> <span><FiPhoneCall className='text-xl text-primary mr-2 mt-1' /> </span> +8801404049797</p>
                                <p className='flex'> <span><LuMailCheck className='text-xl text-primary mr-2 mt-1' /> </span> info@gymstick.com.bd</p>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-5 border-t border-[#D9D9D9] text-center">
                <p className="text-[#534C4C] font-bold text-[14px] md:text-[16px]">
                    CopyRights{new Date().getFullYear()} All rights reserved.<span className='text-primary'> BusTicket</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;