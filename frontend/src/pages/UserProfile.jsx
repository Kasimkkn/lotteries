import React, { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import user from '../images/user.jpeg'
import { getUserById } from "../../../backend/controllers/userController";
const UserProfile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("lottery:user"));
        const fetchUserData = async () => {
            try {
                const response = await getUserById(user.id);
                console.log('response', response);
                if (response.success) {
                    setUserData(response.user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
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
