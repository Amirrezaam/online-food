import PAdminLayout from '@/components/layouts/PAdminLayout'
import serverProps from '@/lib/serverProps.js'
import axios from 'axios';
import { useRef, useState } from 'react'
import FoodModel from '@/models/Food.js'
import connectToDB from '@/configs/db';
import navbarStyles from '@/styles/Navbar.module.css'
import formStyles from '@/styles/LoginRegister.module.css'
import { Field, Form, Formik, useFormik } from 'formik';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '@/components/Loader';
import { sleep } from '@/utils/helper';

export default function Foods({ setOpenEditBox, foodName, price, img, readURL, getFoods, _id }) {

    const [loading, setLoading] = useState(false);
    const [imgEdit, setImgEdit] = useState("");

    const imgEditRef = useRef(null);

    return (
        <>
            <ToastContainer style={{ fontSize: "14px" }} />
            <div className={formStyles.container}>
                <span className={navbarStyles.close} onClick={() => { setOpenEditBox(false); }}>
                    <FontAwesomeIcon icon={faClose} className="fas fa-check" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                </span>
                <div className={formStyles.content}>

                    <h2 className={formStyles.title}>Edit form</h2>

                    <Formik
                        initialValues={{ foodName, price }}
                        validate={values => {
                            const errors = {};

                            if (!values.foodName?.trim()) {
                                errors.foodName = 'Food name is required !';
                            } else if (values.foodName.length < 3) {
                                errors.foodName = 'Food name must not be less than 3 charachters !';
                            }

                            if (!Number(values.price)) {
                                errors.price = "Price is not valid!"
                            }

                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {

                            setLoading(true);

                            await sleep(200)

                            axios.put("/api/food", { _id, name: values.foodName, price: values.price, img: imgEdit || img })
                                .then(async (res) => {
                                    getFoods();
                                    imgEditRef.current.value = null;
                                    setLoading(false);
                                    toast.success("SUCCESS : )))")
                                    setOpenEditBox(false)
                                }).catch(error => {
                                    toast.error(error.response?.data?.message || "ERROR :((")
                                    setLoading(false);
                                })

                        }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div>
                                    <div className={formStyles.input_box}>
                                        <Field
                                            type="text"
                                            name="foodName"
                                            className={formStyles.input}
                                        />
                                        <span className={formStyles.border_active}></span>
                                        <span className={formStyles.active_text}>Food Name</span>
                                    </div>
                                    {errors.foodName && touched.foodName && <span className={formStyles.error_text}>{errors.foodName}</span>}
                                    <div className={formStyles.input_box}>
                                        <Field
                                            type="text"
                                            name="price"
                                            className={formStyles.input}
                                        />
                                        <span className={formStyles.border_active}></span>
                                        <span className={formStyles.active_text}>Price</span>
                                    </div>
                                    {errors.price && touched.price && <span className={formStyles.error_text}>{errors.price}</span>}
                                    <div className="w-100 mt-8">
                                        <input className="input-file" type="file" onChange={(e) => readURL(e, setImgEdit)} ref={imgEditRef} />
                                    </div>
                                </div>

                                {
                                    loading ? <Loader /> :
                                        <div className="flex justify-center mt-8">
                                            <button type="submit" className="btn w-[250px] mt-6">
                                                <span className="right"></span>
                                                <span className="left"></span>
                                                Update
                                            </button>
                                        </div>
                                }
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

        </>
    )
}


export async function getServerSideProps(ctx) {

    const userLogin = await serverProps(ctx)

    if (!userLogin || userLogin.role !== "ADMIN") {
        return {
            redirect: {
                destination: "/"
            }
        }
    }

    connectToDB();

    const foods = await FoodModel.find({});

    return {
        props: {
            foods: JSON.parse(JSON.stringify(foods))
        }
    };
}