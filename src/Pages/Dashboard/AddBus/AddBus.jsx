import { Form, Input } from "antd";
import axios from 'axios';
import Swal from 'sweetalert2';

const AddBus = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        // Assuming the time is entered in a valid "11:00 AM" format
        const formattedValues = { ...values };

        console.log('Formatted Form Values:', formattedValues);

        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token'); // Change this to your token storage logic

            const response = await axios.post('http://localhost:5000/buses', formattedValues, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the headers
                }
            });
            console.log('Server Response:', response.data);

            // Show SweetAlert success message
            Swal.fire({
                title: 'Success!',
                text: 'Bus added successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            form.resetFields();  // Reset the form fields after successful submission
        } catch (error) {
            console.error('Error submitting form', error);

            // Show SweetAlert error message if something goes wrong
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'There was an error adding the bus. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    // Validator function for time input
    const validateTime = (_, value) => {
        const timeFormat = /^([1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        if (value && !timeFormat.test(value)) {
            return Promise.reject(new Error('Please enter time in the format "11:00 AM"'));
        }
        return Promise.resolve();
    };

    return (
        <div className="max-w-[1020px] mx-auto mt-16">
            <h1 className="text-3xl md:text-5xl text-center text-primary">ADD A NEW BUS</h1>
            <div className="login-form mt-4 md:mt-8">
                <Form className="space-y-4" onFinish={onFinish} form={form}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Bus Name:"
                            name="busName"
                            rules={[{ required: true, message: 'Please input the Bus Name!' }]}
                        >
                            <Input placeholder='Input the Bus Name' type="text" className="p-4" />
                        </Form.Item>
                        <Form.Item
                            label="Total Seats:"
                            name="totalSeats"
                            rules={[{ required: true, message: 'Please input the Total Seats!' }]}
                        >
                            <Input placeholder='Input the Total Seats' type="number" className="p-4" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Starting Time:"
                            name="startTime"
                            rules={[
                                { required: true, message: 'Please input Start time!' },
                                { validator: validateTime },
                            ]}
                        >
                            <Input placeholder='Enter Start Time (e.g., 11:00 AM)' type="text" className="p-4" />
                        </Form.Item>
                        <Form.Item
                            label="Estimated Time:"
                            name="estimatedTime"
                            rules={[{ required: true, message: 'Please input the Estimated Time!' }]}
                        >
                            <Input placeholder='Enter Estimated Time (e.g., 11 hour)' type="text" className="p-4" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Starting Point:"
                            name="startingPoint"
                            rules={[{ required: true, message: 'Please input the Starting Point!' }]}
                        >
                            <Input placeholder='Input Starting Point' type="text" className="p-4" />
                        </Form.Item>
                        <Form.Item
                            label="Ending Point:"
                            name="endingPoint"
                            rules={[{ required: true, message: 'Please input the Ending Point!' }]}
                        >
                            <Input placeholder='Input Ending Point' type="text" className="p-4" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1">
                        <Form.Item
                            label="Image URL:"
                            name="imageUrl"
                            rules={[{ required: true, message: 'Please input the Image URL!' }]}
                        >
                            <Input placeholder='Input Image URL' type="url" className="p-4 w-full" />
                        </Form.Item>
                    </div>

                    <button type="submit" className="button w-full !mt-10 !rounded-md">Submit</button>
                </Form>
            </div>
        </div>
    );
};

export default AddBus;
