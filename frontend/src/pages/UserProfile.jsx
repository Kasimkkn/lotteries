import React, { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import user from '../images/user.jpeg'
const UserProfile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("lottery:user"));
        setUserData(user);
    }, []);

    const handlePasswordUpdate = () => {
        alert("Password update functionality will be implemented.");
    };

    return (
        <>
            <HomeHeader />
            <div className="text-white bg-slate-950 min-h-screen md:pt-10">
                <section className="py-7 md:py-12 relative">
                    <div className="flex flex-col md:items-center p-6 mt-5">
                        {userData ? (
                            <>
                                <img
                                    src={user}
                                    alt="User"
                                    className="w-24 h-24 rounded-full mb-4"
                                />
                                <h2 className="text-xl font-semibold mb-2">{userData.username}</h2>
                                <p className="text-white">
                                    <span className="font-medium">Balance:</span> ${userData.balance}
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-600">Loading user data...</p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default UserProfile;
