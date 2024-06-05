import styles from '@/styles/Navbar.module.css'
import formStyles from '@/styles/LoginRegister.module.css'
import axios from 'axios'
import { Field, Form, Formik } from 'formik';
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import Loader from './Loader';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { sleep } from '@/utils/helper';

export default function Navbar({ name, number, role, countOfOrders }) {

    const route = useRouter();

    const [username, setUsername] = useState(name);
    const [loading, setLoading] = useState(false);
    const [openEditBox, setOpenEditBox] = useState(false);
    const [countOfFoods, setCountOfFoods] = useState(0);

    const getUser = () => {
        axios.get("/api/me")
            .then(res => {
                setUsername(res.data.data.name);
                setOpenEditBox(false);
                setLoading(false);
            })
            .catch(err => toast.error(err.response?.data?.message || "ERROR :(("))
    }

    return (
        <>
            {loading && <Loader />}
            <div className={styles.edit_box} style={{ top: openEditBox ? 0 : "-100%" }}>
                <div className={formStyles.container}>
                    <span className={styles.close} onClick={() => setOpenEditBox(false)}>
                        <FontAwesomeIcon icon={faClose} className="fas fa-check" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                    </span>
                    <div className={formStyles.content}>
                        <ToastContainer style={{ fontSize: "14px" }} />
                        <h2 className={formStyles.title}>Edit form</h2>

                        <Formik
                            initialValues={{ name, number }}
                            validate={values => {
                                const errors = {};

                                if (!values.name.trim()) {
                                    errors.name = 'name is required !';
                                } else if (values.name.length < 3) {
                                    errors.name = 'Your name must not be less than 3 charachters !';
                                }

                                if (!values.number.trim()) {
                                    errors.number = 'Number is required !';
                                } else if (!Number(values.number)) {
                                    errors.number = "Number is not valid!"
                                }
                                else if (values.number.length < 11) {
                                    errors.number = 'Your number must not be less than 11 digits !';
                                }

                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    setLoading(true);
                                    const res = await axios.put("/api/user", values)

                                    if (res.status === 200) {
                                        toast.success("SUCCESS : )))");
                                        if (number !== values.number) {
                                            route.replace("/login");
                                            toast.success("SUCCESS : )))");
                                            return;
                                        }
                                        getUser();
                                    }
                                } catch (error) {
                                    toast.error(error.response?.data?.message || "ERROR :((")
                                    setLoading(false);
                                }
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <div className={formStyles.input_box}>
                                        <Field
                                            def
                                            type="text"
                                            name="number"
                                            className={formStyles.input}
                                        />
                                        <span className={formStyles.border_active}></span>
                                        <span className={formStyles.active_text}>Number</span>
                                    </div>
                                    {errors.number && touched.number && <span className={formStyles.error_text}>{errors.number}</span>}
                                    <div className={formStyles.input_box}>
                                        <Field
                                            type="text"
                                            name="name"
                                            className={formStyles.input}
                                        />
                                        <span className={formStyles.border_active}></span>
                                        <span className={formStyles.active_text}>Name</span>
                                    </div>
                                    {errors.name && touched.name && <span className={formStyles.error_text}>{errors.name}</span>}
                                    <div className="flex justify-center items-center">
                                        <button type="submit" className="btn mt-6" style={{ width: "100%" }}>
                                            <span class="right"></span>
                                            <span class="left"></span>
                                            Update
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            <div className={styles.navbar}>
                <div className="container mx-auto flex justify-between items-center">

                    <div className={styles.user_info}>
                        {username}
                        <ul>
                            {role === "ADMIN" &&
                                <li>
                                    <Link href="/p-admin">Admin Panel</Link>
                                </li>
                            }
                            <li onClick={() => setOpenEditBox(true)}>Edit Information</li>
                            <li onClick={() => {
                                Swal.fire({
                                    title: 'Sign Out!',
                                    text: `Are you sure about Sign out ?`,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    reverseButtons: true,
                                    allowEnterKey: true,
                                    cancelButtonText: "Cancel",
                                    confirmButtonText: 'Sign out',
                                    customClass: styles.xxx
                                }).then(async (res) => {
                                    if (res.isConfirmed) {
                                        setLoading(true);

                                        await sleep(200);

                                        axios.post("/api/signout")
                                            .then(res => {
                                                toast.success("SUCCESS :))))")
                                                setLoading(false);
                                                route.push("/login")
                                            })
                                            .catch(err => {
                                                toast.error("ERROR :(((");
                                                setLoading(false);
                                            })
                                    }
                                })
                            }}
                            >
                                Sign out
                            </li>
                        </ul>
                    </div>
                    <h1 className="text-white">Fastfood Online</h1>
                    <Link className="text-white relative" href="/cart">
                        <FontAwesomeIcon icon={faShoppingCart} className="fas fa-check" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                        <span className="text-white absolute bg-gray-400 flex items-center justify-center top-[-.75rem] w-[18px] h-[18px] rounded-full p-0 right-[-.75rem]">{countOfOrders}</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

