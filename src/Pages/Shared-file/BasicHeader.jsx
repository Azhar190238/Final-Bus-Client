/* eslint-disable react/prop-types */
import headerImage from '../../assets/header.png';

const BasicHeader = ({ heading }) => {
    return (
        <section 
            className="relative w-full h-[200px] mt-28 flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${headerImage})` }}
        >
            <div className="absolute inset-0 bg-black opacity-90" />
            <h2 className="relative text-3xl md:text-4xl lg:text-5xl font-bold capitalize text-white"> {heading} </h2>
        </section>
    );
};

export default BasicHeader;
