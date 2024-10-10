
import { Outlet } from 'react-router-dom';
import Footer from '../Pages/Shared-file/Footer/Footer';
import Navbar from '../Pages/Shared-file/Navbar/Navbar';

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Main;