const Profile = () => {
    return (
        <div className="max-w-[800px] mx-auto mt-16 text-center">
            <img
                src="/src/assets/about/admin.jpeg"  // Make sure to replace this with the actual image path
                alt="Azhar's Profile"
                className="w-[500px] h-[500px] object-cover mx-auto"
            />
            <h1 className="text-4xl font-semibold mt-4">MD AZHARUDDIN</h1>
            <p className="mt-6 mb-10 text-gray-600">
                I am a passionate web developer skilled in HTML, CSS, JavaScript, React, Node.js, and more. 
                I enjoy building scalable, responsive web applications and constantly seek new challenges to improve my skills.
            </p>
        </div>  
    );
};

export default Profile;
