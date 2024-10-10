// eslint-disable-next-line react/prop-types
const SectionHeader = ({heading, description}) => {
    return (
        <div className='mx-auto px-3 md:px-4'>
            <h1 className='heading'>{heading}</h1>
            <p className='description text-center mt-4 w-full md:w-2/3 mx-auto'>{description}</p>
        </div>
    );
};

export default SectionHeader;