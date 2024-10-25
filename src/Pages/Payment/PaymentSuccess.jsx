import { Link, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccess = () => {
    const { tran_id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Fetch the order details using the transaction ID from the backend
        axios.get(`https://api.koyrabrtc.com/order/${tran_id}`)
            .then(response => {
                setOrderDetails(response.data);
            })
            .catch(error => {
                console.error("Error fetching order details:", error);
            });
    }, [tran_id]);

    const downloadInvoice = () => {
        const doc = new jsPDF();

        // Define Colors
        const primaryColor = "#FF4E25"; // Main color
        const secondaryColor = "#333333"; // Text color
        const backgroundColor = "#F5F5F5"; // Light background for sections

        // Adding Logo at Top
        const logoImg = 'https://i.postimg.cc/Dwb41d5t/logo.png';
        const imgWidth = 40;
        const imgHeight = 40;
        const xOffset = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
        doc.addImage(logoImg, "PNG", xOffset, 10, imgWidth, imgHeight);

        // Add a colored header
        doc.setFillColor(primaryColor);
        doc.rect(0, 55, doc.internal.pageSize.getWidth(), 20, 'F'); // Full-width background
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor('#FFFFFF'); // White text
        doc.text("BRTC Bus Service - Official Ticket", 105, 67, null, null, "center");

        // Ticket Details Section
        if (orderDetails) {
            // Background box for ticket details
            doc.setFillColor(backgroundColor);
            doc.rect(15, 85, 180, 120, 'F');

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(primaryColor);
            doc.text("Ticket Details", 20, 95);

            // Set coordinates for 2-column layout
            const leftColumnX = 20;
            const rightColumnX = 110;
            let yPosition = 110; // Initial Y position for content

            // Passenger Information (left column)
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(secondaryColor);
            doc.text(`Name: ${orderDetails.name}`, leftColumnX, yPosition);
            yPosition += 10;
            doc.text(`Email: ${orderDetails.email}`, leftColumnX, yPosition);
            yPosition += 10;
            doc.text(`Phone: ${orderDetails.phone}`, leftColumnX, yPosition);
            yPosition += 10;
            doc.text(`Address: ${orderDetails.address}`, leftColumnX, yPosition);
            yPosition += 10;
            doc.text(`Route: ${orderDetails.selectedRoute}`, leftColumnX, yPosition);
            yPosition += 10;
            doc.text(`Date: ${orderDetails.date}`, leftColumnX, yPosition);

            // Bus Information and Seat/Price Info (right column)
            yPosition = 110; // Reset Y position for the right column
            doc.text(`Bus Name: ${orderDetails.busName}`, rightColumnX, yPosition);
            yPosition += 10;
            doc.text(`Reference: ${orderDetails.counterMaster}`, rightColumnX, yPosition);
            yPosition += 10;
            doc.text(`Counter Location: ${orderDetails.location}`, rightColumnX, yPosition);
            yPosition += 10;
            doc.text(`Allocated Seat(s): ${orderDetails.allocatedSeat.join(", ")}`, rightColumnX, yPosition);
            yPosition += 10;
            doc.text(`Price: ${orderDetails.price} BDT`, rightColumnX, yPosition);

            // Add a line separator before footer
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yPosition + 20, 190, yPosition + 20);

            // Footer Section
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(secondaryColor);
            const now = new Date();
            const timestamp = now.toLocaleString();
            doc.text(`Downloaded at: ${timestamp}`, leftColumnX, yPosition + 30);

            // Thank you message with color
            doc.setTextColor(primaryColor);
            doc.setFont("helvetica", "bold");
            doc.text("Thank you for using BRTC Bus Service.", 105, yPosition + 40, null, null, "center");

            // Save the PDF
            doc.save("Bus_Ticket.pdf");
        } else {
            alert("Unable to generate invoice. Please try again.");
        }
    };

    return (
        <div className="px-8 lg:px-0 mt-40 max-w-[1320px] mx-auto">
            <div className="bg-[#FF4E25] mx-auto max-w-[868px] px-5 md:px-[150px] lg:px-[250px] py-20 md:py-[100px] lg:py-[150px] rounded bg-opacity-10">
                <p className="auth-heading">Your Payment Successfully Done</p>
                <p className="mt-5 text-xl text-green-700 text-center">Your transaction ID: {tran_id}</p>

                <button className="mt-10 button w-full" onClick={downloadInvoice}>
                    Download Ticket
                </button>

                <Link to='/'><button className="mt-10 button w-full">Continue</button></Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
