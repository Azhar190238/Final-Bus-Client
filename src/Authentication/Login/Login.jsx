import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, Input } from 'antd';
import login from '../../assets/service/card1.png';
import { Link } from 'react-router-dom';

const Login = () => {
    const [role, setRole] = useState('member');
    const [active, setActive] = useState('member');
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const returnLocation = useLocation
    const from = returnLocation.state?.from?.pathname || '/';


    const handleClick = (value) => {
        setRole(value);
        setActive(value);
    };

    const onFinish = async (values) => {
        console.log({ ...values, role });
        try {
            // Send phone, password, and role to the server
            const response = await axios.post('http://localhost:5000/login', {
                phone: values.phone,
                password: values.password,
                role: role // Send the selected role
            });

            console.log('Server Response:', response.data);

            Swal.fire({
                icon: 'success',
                title: 'Login successful',
                showConfirmButton: false,
                timer: 2000
            });

            localStorage.setItem('token', response.data.token);

            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login error:', error);

            // Check if the error is due to role mismatch (403)
            if (error.response && error.response.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'The role does not match. Please select the correct role.'
                });
            }
            else if (error.response && error.response.status === 402) {
                Swal.fire({
                    icon: 'error',
                    title: 'User Not Found',
                    text: 'User not found in Your input data. Please Login.'
                });
            }
            // Check if user credentials are wrong (401)
            else if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: error.response.data.message || 'Invalid phone number or password'
                });
            } else {
                // General error message
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: 'An error occurred. Please try again later.'
                });
            }
        }

        form.resetFields();
    };

    return (
        <div>
            <div className="bus-container">
                <div className="flex items-center flex-col md:flex-row space-x-0 md:space-x-14 lg:space-x-20 rounded">
                    <div className="flex-1">
                        <img src={login} alt="Login Visual" />
                    </div>
                    <div className="flex-1 pr-0 md:pr-16 lg:pr-[112px] py-10">
                        <div className="">
                            <p className="text-[32px] font-bold">Login as</p>
                            <div className="flex mt-4 space-x-2 md:space-x-6">
                                <button onClick={() => handleClick('member')} className={`p-4 text-sm border rounded-md ${active === 'member' ? 'bg-primary text-white' : ''}`}>
                                    General Member
                                </button>
                                <button onClick={() => handleClick('master')} className={`p-4 text-sm border rounded-md ${active === 'master' ? 'bg-primary text-white' : ''}`}>
                                    Counter Master
                                </button>
                                <button onClick={() => handleClick('admin')} className={`p-4 text-sm border rounded-md ${active === 'admin' ? 'bg-primary text-white' : ''}`}>
                                    Admin
                                </button>
                            </div>
                            <div className="login-form mt-4 md:mt-8">
                                <Form className="space-y-4" onFinish={onFinish} form={form}>
                                    <Form.Item
                                        label="Phone Number: "
                                        name="phone"
                                        rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                                    >
                                        <Input placeholder='Input your Phone Number' type='number' className='p-4' />
                                    </Form.Item>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please input your password!' }]}
                                    >
                                        <Input.Password placeholder='Input your Password' className='p-4' />
                                    </Form.Item>
                                    <div className='mt-4'>
                                        <Link to='/forgetPassword' className='underline text-sm md:text-xl text-primary font-bold'>Forget Password</Link>
                                    </div>
                                    <button type="submit" className="button w-full !mt-10 !rounded-md"> Log In </button>
                                </Form>
                                <p className="mt-4 text-center">Do not have an account? <Link to="/signup" className="underline text-primary font-bold">Sign Up</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
