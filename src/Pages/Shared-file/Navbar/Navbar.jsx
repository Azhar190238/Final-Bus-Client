import { useState, useEffect } from 'react';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircle } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import AuthButton from '../../../Authentication/AuthButton/AuthButton';

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    const activeItem = links.find(link => link.path === currentPath);
    if (activeItem) {
      setActiveLink(activeItem.name);
    }
  }, []);

  const handleLinkClick = (linkName, path) => {
    setActiveLink(linkName);
    setIsOpen(false);
    if (path) {
      navigate(path);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const renderLinks = () =>
    links.map((link, index) => (
      <div key={index}>
        <a
          href={link.path}
          className={`font-noto text-[18px]  font-medium ${activeLink === link.name ? 'text-[#fff] bg-primary px-3 py-2 rounded' : 'text-[#030712]'
            }`}
          onClick={() => handleLinkClick(link.name, link.path)}
        >
          {link.name}
        </a>
      </div>
    ));

  return (
    <nav className="fixed top-0 w-full h-fit z-20 pt-2 bg-[#fff]">
      <div className="max-w-[1320px] mx-auto  px-4  flex items-center justify-between">
        <a href="/">
          <img
            src="/src/assets/logo.png"
            alt="logoImage"
            className="w-20 h-20 bg-primary rounded-full p-1"
          />
        </a>

        <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2 ml-8">
          <button className="border-2 border-[#E67529]  animate-pulse-scale px-4 md:px-8 py-4 rounded-[4px] hover:bg-[#E67529] hover:text-white text-primary transition">
            Buy Tickets
          </button>
        </div>

        <div className="lg:hidden flex flex-col justify-center">
          <button
            onClick={toggleMenu}
            className="text-[#030712] focus:outline-none absolute right-4"
          >
            {isOpen ? (
              <IoMdCloseCircle className="text-3xl" />
            ) : (
              <GiHamburgerMenu className="text-3xl" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex items-center text-[18px] font-medium text-[#030712]   space-x-10">
          {renderLinks()}
        </div>

        <div className='flex space-x-4'>
          <div>
            <AuthButton />
          </div>
          <div className="hidden lg:flex relative justify-center lg:justify-end">
            <button
              className="border-2 border-[#E67529] animate-pulse-scale  px-4 md:px-8 py-4 rounded-[4px] hover:bg-[#E67529] hover:text-white text-primary"
            >
              Buy Tickets
            </button>
          </div>
        </div>

      </div>

      <div className="h-[1px] mt-2 w-full relative bg-gray-500"></div>

      {isOpen && (
        <div className="lg:hidden absolute top-28 left-0 w-1/3 z-50 flex flex-col text-[18px] bg-primary font-medium px-4 space-y-4">
          {renderLinks(true)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
