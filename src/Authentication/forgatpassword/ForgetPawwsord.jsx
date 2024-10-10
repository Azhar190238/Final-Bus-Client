import { Form, Input } from 'antd';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const axiosSecurePublic = useAxiosPublic();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [form] = Form.useForm();

    const auth = { phone, email };

    const onFinish = async () => {
        try {
            const response = await axiosSecurePublic.post('/forgetPassword', auth);

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'User Found',
                    text: ` Check Email : ${response.data.email}`, 
                    showConfirmButton: true,
                });
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Swal.fire({
                    icon: 'error',
                    title: 'User Not Found',
                    text: 'The phone number you entered does not exist in our records. Please sign up.',
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
                <p className="auth-heading">Forgot Password</p>
                <p className="text-center mt-3">Please confirm your phone number below, and we will send you a verification code.</p>
                <Form className="mt-6 login-form md:mt-8 lg:mt-12" onFinish={onFinish} form={form}>
                    <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                    >
                        <Input
                            placeholder="Input your Phone Number"
                            type="number"
                            className="p-4"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input
                            placeholder="Input your Email"
                            type="email"
                            className="p-4"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    <button type="submit" className="font-poppins w-full button py-4 mt-5 md:mt-6 lg:mt-8">Continue</button>
                </Form>
            </div>
        </div>
    );
};

export default ForgetPassword;
