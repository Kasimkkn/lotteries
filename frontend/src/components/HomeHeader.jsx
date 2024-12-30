import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { CiMenuFries } from "react-icons/ci";

const HomeHeader = () => {
    const navigate = useNavigate();
    const [nav, setNav] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('lottery:user');
        localStorage.removeItem('lottery:token');
        navigate('/login');
    };

    return (
        <header className='bg-black fixed w-full top-0 z-50'>
            <nav className="px-4 lg:px-6 py-2 md:py-6">
                <div className="flex max-md:flex-wrap justify-between items-center">
                    <Link to="#" className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                            Logo
                        </span>
                    </Link>

                    <div
                        className={`flex-col z-50 md:justify-center flex md:flex-row items-center transition-all duration-300 ${nav
                            ? 'absolute bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-50 top-14 left-0 max-md:w-full shadow-md p-4 md:relative md:top-0  md:bg-transparent md:shadow-none'
                            : 'hidden md:flex gap-6'
                            }`}
                    >
                        <ul className="w-full flex flex-col md:flex-row md:gap-8 gap-0">
                            <li>
                                <Link
                                    to="/"
                                    className="block py-2 pr-4 pl-3 text-white border-b md:border-0  md:px-2 md:py-0.5 "
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    className="block py-2 pr-4 pl-3 text-white border-b md:border-0  md:p-0 "
                                >
                                    Competitions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/my-tickets"
                                    className="block py-2 pr-4 pl-3 text-white border-b md:border-0  md:p-0 "
                                >
                                    My Tickets
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className="block py-2 pr-4 pl-3 text-white border-b md:border-0  md:p-0 "
                                >
                                    Profile
                                </Link>
                            </li>
                            <li className='md:hidden'>
                                <button onClick={handleLogout} className='block py-2 pr-4 pl-3 text-white'>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className='max-md:hidden'>
                        <button onClick={handleLogout} className='text-white'>
                            Logout
                        </button>
                    </div>

                    {/* Hamburger Icon */}
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg  focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={nav}
                            onClick={() => setNav(!nav)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {nav ? (
                                <IoMdClose className="w-6 h-6" />
                            ) : (
                                <CiMenuFries className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default HomeHeader;
