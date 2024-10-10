import { Link } from "react-router-dom";

const PaymentFail = () => {
    return (
        <div className="px-8 lg:px-0 mt-40 max-w-[1320px] mx-auto">
            <div className="bg-[#FF4E25] mx-auto max-w-[868px] px-5 md:px-[150px] lg:px-[250px] py-20 md:py-[100px] lg:py-[150px] rounded bg-opacity-10">
                <p className="auth-heading">Your Payment is Fail</p>
                <p className="text-xl text-yellow-400 text-center">Please Tty Again</p>
                <Link to='/'><button className=" mt-10 button w-full">Home</button></Link>
            </div>

        </div>
    );
};

export default PaymentFail;