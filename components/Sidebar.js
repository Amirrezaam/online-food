import styles from '@/styles/Sidebar.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faClose, faHamburger, faHome, faBarsProgress, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { useState } from 'react';
import Loader from './Loader';
import { sleep } from '@/utils/helper';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Sidebar({ openSidebar, setOpenSidebar }) {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    return (
        <>
            {loading && <Loader />}
            <div className={`${styles.sidebar} w-[100%] ${openSidebar ? "right-0" : "right-[-100%]"} lg:right-0 lg:w-[20%]`} style={{ background: "rgb(49, 45, 45)" }}>
                <button className="lg:hidden absolute top-1 right-3 text-white" onClick={() => setOpenSidebar(false)}>
                    <FontAwesomeIcon icon={faClose} className="fas fa-check" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                </button>
                <ul className="w-[100%] flex flex-col items-center justify-center">
                    <li className={`${router.pathname === "/p-admin" && "bg-orange-500"} text-center w-[90%] rounded-lg hover:bg-orange-600 transition cursor-pointer`}>
                        <Link className="w-100 py-2 block" href={`/p-admin`}>
                            <FontAwesomeIcon icon={faHome} className="fas fa-check mr-2" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                            Home
                        </Link>
                    </li>
                    <li className={`${router.pathname === "/p-admin/foods" && "bg-orange-500"} text-center w-[90%] rounded-lg mt-4 hover:bg-orange-600 transition cursor-pointer`}>
                        <Link className="w-100 py-2 block" href={`/p-admin/foods`}>
                            <FontAwesomeIcon icon={faHamburger} className="fas fa-check mr-2" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                            Foods
                        </Link>
                    </li>
                    <li className={`${router.pathname === "/p-admin/orders" && "bg-orange-500"} text-center w-[90%] rounded-lg mt-4 hover:bg-orange-600 transition cursor-pointer`}>
                        <Link className="w-100 py-2 block" href={`/p-admin/orders`}>
                            <FontAwesomeIcon icon={faBell} className="fas fa-check mr-2" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                            Orders
                        </Link>
                    </li>
                    <li className={`${router.pathname === "/p-admin/users" && "bg-orange-500"} text-center w-[90%] rounded-lg mt-4 hover:bg-orange-600 transition cursor-pointer`}>
                        <Link className="w-100 py-2 block" href={`/p-admin/users`}>
                            <FontAwesomeIcon icon={faUser} className="fas fa-check mr-2" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                            Users
                        </Link>
                    </li>
                    <li className={`text-center w-[90%] rounded-lg hover:bg-orange-600 mt-4 transition cursor-pointer`}>
                        <Link className="w-100 py-2 block" href={`/`}>
                            <FontAwesomeIcon icon={faBarsProgress} className="fas fa-check mr-2" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                            Menu
                        </Link>
                    </li>

                    <li
                        className={`text-center w-[90%] rounded-lg hover:bg-orange-600 mt-4 transition cursor-pointer py-2`}
                        onClick={() => {
                            Swal.fire({
                                title: 'Sign Out!',
                                text: `Are you sure about Sign out ?`,
                                icon: 'warning',
                                showCancelButton: true,
                                reverseButtons: true,
                                allowEnterKey: true,
                                cancelButtonText: "Cancel",
                                confirmButtonText: 'Sign out'
                            }).then(async (res) => {
                                if (res.isConfirmed) {
                                    setLoading(true);

                                    await sleep(200);

                                    axios.post("/api/signout")
                                        .then(res => {
                                            toast.success("SUCCESS :))))")
                                            setLoading(false);
                                            router.push("/login")
                                        })
                                        .catch(err => {
                                            toast.error("ERROR :(((");
                                            setLoading(false);
                                        })
                                }
                            })
                        }}
                    >
                        <FontAwesomeIcon icon={faSignOut} className="fas fa-check mr-2" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                        Sign out
                    </li>
                </ul>
            </div>
        </>
    )
}
