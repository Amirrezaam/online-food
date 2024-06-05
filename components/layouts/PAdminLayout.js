import styles from '@/styles/PAdmin.module.css'
import { useState } from 'react'
import Sidebar from '../Sidebar'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function PAdminLayout({ children }) {

    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <>
            <div className="lg:hidden fixed top-0 right-0 w-[100%] py-2 shadow text-right px-4 z-[999]" style={{ background: "rgb(49, 45, 45)" }}>
                <button onClick={() => setOpenSidebar(true)}>
                    <FontAwesomeIcon icon={faBars} className="fas fa-check" style={{ color: "#fff" }}></FontAwesomeIcon>
                </button>
            </div>
            <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
            <div className={`${styles.container} mt-8 lg:mt-0 lg:mr-[20%]`}>
                {children}
            </div>
        </>
    )
}
