import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import styles from '@/styles/LoginRegister.module.css'
import Loader from '@/components/Loader';
import serverProps from '@/lib/serverProps'
import { useRouter } from 'next/router';

export default function Register() {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    return (
        <div className={styles.container}>
            {loading && <Loader />}
            <div className={styles.content}>
                <ToastContainer style={{ fontSize: "14px" }} />
                <h2 className={styles.title}>Signup form</h2>

                <Formik
                    initialValues={{ password: "", name: "", number: "" }}
                    validate={values => {
                        const errors = {};

                        if (!values.name.trim()) {
                            errors.name = 'name is required !';
                        } else if (values.name.length < 3) {
                            errors.name = 'Your name must not be less than 3 charachters !';
                        }

                        if (!values.password.trim()) {
                            errors.password = 'Password is required !';
                        } else if (values.password.length < 8) {
                            errors.password = 'Your password must not be less than 8 charachters !';
                        } else if (!values.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)) {
                            errors.password = "Password must contains number, lower and uppercase letters and special characters"
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
                            const res = await axios.post("/api/register", values)

                            if (res.status === 201) {
                                router.push("/")
                                toast.success("SUCCESS : )))")
                                setLoading(false);
                            }
                        } catch (error) {
                            toast.error(error.response?.data?.message || "ERROR :((")
                            setLoading(false);
                        }
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className={styles.input_box}>
                                <Field
                                    type="text"
                                    name="name"
                                    className={styles.input}
                                />
                                <span className={styles.border_active}></span>
                                <span className={styles.active_text}>Name</span>
                            </div>
                            {errors.name && touched.name && <span className={styles.error_text}>{errors.name}</span>}
                            <div className={styles.input_box}>
                                <Field
                                    type="text"
                                    name="number"
                                    className={styles.input}
                                />
                                <span className={styles.border_active}></span>
                                <span className={styles.active_text}>Number</span>
                            </div>
                            {errors.number && touched.number && <span className={styles.error_text}>{errors.number}</span>}
                            <div className={styles.input_box}>
                                <Field
                                    type="password"
                                    name="password"
                                    className={styles.input}
                                />
                                <span className={styles.border_active}></span>
                                <span className={styles.active_text}>Password</span>
                            </div>
                            {errors.password && touched.password && <span className={styles.error_text}>{errors.password}</span>}
                            <div className="flex justify-center">
                                <button type="submit" className="btn mt-6 block w-[100%]">
                                    <span className="right"></span>
                                    <span className="left"></span>
                                    Submit
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <span className="block text-center mt-5 text-white">Do you have an account already? <Link href="/login" className="underline">LOGIN</Link> </span>
            </div>
        </div>
    )
}


export async function getServerSideProps(ctx) {

    const userLogin = await serverProps(ctx)

    if (userLogin) {
        return {
            redirect: {
                destination: "/"
            }
        }
    }

    return {
        props: {}
    };
}