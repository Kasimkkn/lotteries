import React, { useEffect, useState } from 'react';
import HomeHeader from '../components/HomeHeader';
import ProductCard from '../components/ProductCard';
import ProductDetails from '../components/ProductDetails';
import { getAllRaffles } from '../service/apiServices';
import banner from '../images/banner.jpeg'
import Modal from '../components/Modal';
const Home = () => {
    const [raffle, setRaffle] = useState([]);
    const [fullViewProduct, setFullViewProduct] = useState(null);
    const [fullViewModal, setFullViewModal] = useState(false);

    const fetchRaffle = async () => {
        try {
            const response = await getAllRaffles();
            if (response.success) {
                setRaffle(response.raffles);
            }
        } catch (error) {
            console.log('error fetching raffle', error);
        }
    };

    const toggleFullViewModal = (data) => {
        setFullViewModal(!fullViewModal);
        if (!data) return;
        setFullViewProduct(data);
    };

    useEffect(() => {
        fetchRaffle();
    }, []);

    return (
        <>
            <HomeHeader />
            <div className={`text-white bg-slate-950  ${fullViewModal ? 'blur-sm' : ''}`}>

                {/* Main Banner */}
                <div className="w-full h-[400px] relative">
                    <img
                        src={banner}
                        alt="Main banner"
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold">Win Big!</h2>
                        <p className="text-lg font-semibold">Join for Just $1.99</p>
                        <div className="flex gap-2 mt-2">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[35px] h-[35px] rounded-md bg-white text-black flex items-center justify-center"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rest of the page */}
                <div className="flex flex-wrap justify-evenly py-4 bg-white text-black">
                    <div>£100+ Entries to Draw</div>
                    <div>50+ Happy Winners</div>
                    <div>1000+ Total Prizes</div>
                    <div>£500+ Donated to Charities</div>
                </div>

                {/* Countdown Timer */}
                <div className="py-4 border-b border-t border-white  justify-center gap-4 md:gap-10  flex max-md:flex-col items-center bg-black text-white">
                    <h3 className="text-lg font-semibold">UNTIL THE NEXT LIVE DRAW</h3>
                    <div className="flex justify-center gap-2 text-lg">
                        <span>44</span>:<span>11</span>:<span>13</span>:<span>22</span>
                    </div>
                    <button className=" px-4 py-2 rounded-md bg-white text-black">
                        Enter Now
                    </button>
                </div>

                <div className="font-sans py-4 mx-auto lg:max-w-6xl md:max-w-4xl max-w-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
                        Latest Raffle
                    </h2>
                    <div className="max-md:p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 gap-8">
                        {raffle?.map((raf) => (
                            <ProductCard key={raf._id} product={raf} toggleFullViewModal={toggleFullViewModal} />
                        ))}
                    </div>
                </div>
            </div>

            {fullViewModal && (
                <Modal
                    title={` `}
                    width={'max-w-3xl'}
                    onClose={toggleFullViewModal} >
                    <ProductDetails product={fullViewProduct} toggleFullViewModal={toggleFullViewModal} />
                </Modal>
            )}
        </>
    );
};

export default Home;
