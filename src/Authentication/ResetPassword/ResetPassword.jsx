import { Form, Input } from 'antd';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // If using React Router for navigation
import Swal from 'sweetalert2';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [form] = Form.useForm();
    const { token } = useParams(); 
    const navigate = useNavigate();
    const axiosSecurePublic = useAxiosPublic();


    const onFinish = async () => {
        try {
            // Send both the token and new password in the request body
            const response = await axiosSecurePublic.post('/resetPassword', {
                token,
                newPassword: password,
            });
    
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Please login Now',
                    showConfirmButton: true,
                });
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'User Not Found',
                    text: 'Please sign up.',
                    showConfirmButton: true,
                });
                navigate('/signup');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Something Went Wrong',
                    text: 'Please try again later.',
                    showConfirmButton: true,
                });
            }
        }
    
        form.resetFields();
    };
    
    return (
        <div className="px-8 lg:px-0 mt-40 max-w-[1320px] mx-auto">
            <div className="bg-[#FF4E25] mx-auto max-w-[868px] px-5 md:px-[150px] lg:px-[250px] py-20 md:py-[100px] lg:py-[150px] rounded bg-opacity-10">
                <p className="auth-heading">Reset Password</p>
                <p className="mt-3 capitalize text-center">
                    Please input a new password and try to remind it
                </p>
                <div className="mx-auto w-full flex justify-center login-form mt-5">
                    <Form className="w-full mt-6 md:mt-8 lg:mt-12" onFinish={onFinish} form={form}>
                        <Form.Item
                            label="New Password:"
                            name="newPassword"
                            rules={[{ required: true, message: 'Please input your new Password!' }]}
                        >
                            <Input
                                placeholder="Input your New Password"
                                type="password"
                                className="p-4"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>
                        <button
                            type="submit"
                            className="font-poppins w-full button py-4 mt-5 md:mt-6 lg:mt-8"
                        >
                            Continue
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
