import { useState } from 'react';
import { Collapse } from 'antd';
import { RiArrowDropDownLine } from 'react-icons/ri';


const faqData = {
  general: [
    { key: '1', label: 'What are the operating hours of the bus terminal?', content: 'The bus terminal operates daily from 6:00 AM to 10:00 PM, providing services throughout the day for your convenience.' },
    { key: '2', label: 'How can I purchase a bus ticket?', content: 'Tickets can be purchased at the terminal ticket counter or through our online booking system for added convenience' },
    { key: '3', label: 'Are there facilities available at the bus terminal?', content: 'Yes, the bus terminal offers various facilities, including waiting areas, restrooms, food stalls, and free Wi-Fi access for travelers.' },
    { key: '4', label: 'What should I do if my bus is delayed?', content: 'In case of a delay, please check the display boards for updated information or consult our staff at the information desk for assistance.' },
  ],
  support: [
    { key: '1', label: 'How can I contact customer support?', content: 'You can reach customer support via email at support@example.com or call us at (123) 456-7890. We are here to help you 24/7.' },
    { key: '2', label: ' What should I do if I encounter an issue with my ticket?', content: 'If you encounter any issues with your ticket, please contact our customer support team immediately. Have your booking reference number ready for quicker assistance.' },
    { key: '3', label: ' How can I reset my password?', content: 'To reset your password, click on the "Forgot Password?" link on the login page and follow the instructions sent to your registered email.' },
    { key: '4', label: 'Can I change my travel dates after booking?', content: 'Yes, you can change your travel dates, subject to availability and any applicable fees. Please contact our customer support for assistance with changes to your booking.' },
  ],
  contact: [
    { key: '1', label: 'How can I update my contact information?', content: 'You can update your contact information by logging into your account and navigating to the "Profile" section. If you need assistance, feel free to contact customer support.' },
    { key: '2', label: ' Where is your office located?', content: 'Our office is located at 123 Main Street, Anytown, USA. You are welcome to visit us during our business hours.' },
  ],
  service: [
    { key: '1', label: 'What services do you offer?', content: 'We offer a variety of services including bus transportation, package delivery, and charter services for events and special occasions.' },
    { key: '2', label: 'What should I do if I need to cancel my service?', content: 'If you need to cancel your service, please contact our customer support team at least 24 hours in advance to avoid any cancellation fees. You can also cancel your booking through your account on our website.' },
  ],
};

const Faq = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [activeKey, setActiveKey] = useState(['1']);
  const tabs = ['general', 'support', 'contact', 'service'];

  return (
    <div className="max-w-[1320px] mt-20 mx-auto">
     
      <div className="mb-14">
        <h1 className="heading">Frequently Asked Questions</h1>
        <p className="para1 mt-10 max-w-[650px] mx-auto text-center">
        Explore our FAQs for quick answers to your most pressing questions. Whether it iss about our services, support, or contact, we have got you covered!
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 rounded">
          <div className="px-8  space-y-6 shadow-custom-light">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={`border rounded cursor-pointer ${activeTab === tab ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}`}
                onClick={() => setActiveTab(tab)}
              >
                <p className="px-6 py-4 capitalize text-[16px] font-medium">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <Collapse
            accordion
            activeKey={activeKey}
            onChange={setActiveKey}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <RiArrowDropDownLine
                style={{
                  fontSize: '30px',
                  color: isActive ? '#E67529' : 'black',
                  transform: `rotate(${isActive ? 180 : 0}deg)`,
                  transition: 'transform 0.5s ease',
                }}
              />
            )}
            items={faqData[activeTab].map((item) => ({
              key: item.key,
              label: (
                <span
                  className={`${activeKey.includes(item.key) ? 'text-primary' : 'text-[#534C4C]'} text-xl font-semibold`}
                >
                  {item.label}
                </span>
              ),
              children: <p>{item.content}</p>,
              className: 'mb-6 py-2 px-4 !border rounded',
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Faq;
