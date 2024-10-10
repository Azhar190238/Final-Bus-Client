import { useState } from 'react';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddRoute = () => {
    const [busName, setBusName] = useState('');
    const [routes, setRoutes] = useState([{ routeName: '', price: '' }]);

    const handleBusNameChange = (e) => {
        setBusName(e.target.value);
    };

    const handleRouteChange = (index, e) => {
        const newRoutes = [...routes];
        newRoutes[index][e.target.name] = e.target.value;
        setRoutes(newRoutes);
    };

    const addRoute = () => {
        setRoutes([...routes, { routeName: '', price: '' }]);
    };

    const removeRoute = (index) => {
        const newRoutes = routes.filter((_, i) => i !== index);
        setRoutes(newRoutes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data to send
        const busData = { busName, routes };

        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token in the headers
                },
                body: JSON.stringify(busData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Bus Details:', result);
                
                // Show success alert
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Bus and routes have been added successfully!',
                });

                // Reset fields after successful submission
                setBusName('');
                setRoutes([{ routeName: '', price: '' }]);
            } else {
                // Handle errors if response is not ok
                const error = await response.json();
                await Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.message || 'Something went wrong. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error submitting bus data:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Internal Server Error. Please try again later.',
            });
        }
    };

    return (
        <div className="max-w-[1000px] mx-auto mt-16">
            <h1 className="text-3xl md:text-5xl text-center text-primary">ADD A NEW Route</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="busName" className="block mb-1">
                        Bus Name:
                    </label>
                    <input
                        type="text"
                        id="busName"
                        value={busName}
                        onChange={handleBusNameChange}
                        className="border border-primary rounded px-4 py-3 w-full"
                        required
                    />
                </div>

                <h3 className="text-lg font-semibold">Routes</h3>
                {routes.map((route, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            name="routeName"
                            value={route.routeName}
                            onChange={(e) => handleRouteChange(index, e)}
                            placeholder="Route Name"
                            className="border border-primary rounded px-4 py-3 flex-1"
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            value={route.price}
                            onChange={(e) => handleRouteChange(index, e)}
                            placeholder="Price"
                            className="border border-primary rounded px-4 py-3 max-w-80"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeRoute(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addRoute}
                    className="text-primary border py-2 px-4 rounded border-primary hover:text-white hover:bg-primary"
                >
                    Add Route
                </button>
                <div>
                    <button
                        type="submit"
                        className="text-primary border w-60 flex justify-center mx-auto py-5 px-10 rounded border-primary text-2xl hover:text-white hover:bg-primary"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRoute;
