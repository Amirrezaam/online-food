import PAdminLayout from '@/components/layouts/PAdminLayout'
import serverProps from '@/lib/serverProps.js'
import axios from 'axios';
import { useRef, useState } from 'react'
import FoodModel from '@/models/Food.js'
import connectToDB from '@/configs/db';
import navbarStyles from '@/styles/Navbar.module.css'
import formStyles from '@/styles/LoginRegister.module.css'
import { Field, Form, Formik } from 'formik';
import EditFood from "@/components/EditFood"
import { toast, ToastContainer } from 'react-toastify';
import Loader from '@/components/Loader';
import { sleep } from '@/utils/helper';
import Swal from 'sweetalert2';

export default function Foods({ foods }) {

    const [loading, setLoading] = useState(false);
    const [openEditBox, setOpenEditBox] = useState(false);
    const [img, setImg] = useState("");
    const [foodsList, setFoodsList] = useState(foods);
    const [selectedFood, setSelectedFood] = useState(null);

    const imgRef = useRef(null);

    function readURL(event, func) {
        let input = event.target;

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // imgRef.current.src = e.target.result;
                func(e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    const getFoods = async () => {
        const res = await axios.get("/api/food");
        setFoodsList(res.data.data)
    }

    return (
        <PAdminLayout>

            {loading && <Loader />}
            <ToastContainer />

            <div className={`${navbarStyles.edit_box}`} style={{ top: openEditBox ? 0 : "-100%" }}>
                {
                    openEditBox &&
                    <EditFood
                        setOpenEditBox={setOpenEditBox}
                        setSelectedFood={setSelectedFood}
                        _id={selectedFood._id}
                        foodName={selectedFood.name}
                        price={selectedFood.price}
                        img={selectedFood.img}
                        readURL={readURL}
                        getFoods={getFoods}
                    />
                }
            </div>

            <div className="border-solid border-white border p-3 rounded-md">
                <h2 className="text-[32px] text-center text-white mb-10 font-bold">Add Food Form</h2>
                <Formik
                    initialValues={{ foodName: "", price: "" }}
                    validate={values => {
                        const errors = {};

                        if (!values.foodName.trim()) {
                            errors.foodName = 'Food name is required !';
                        } else if (values.foodName.length < 3) {
                            errors.foodName = 'Food name must not be less than 3 charachters !';
                        }

                        if (!values.price.trim()) {
                            errors.price = 'Price is required !';
                        } else if (!Number(values.price)) {
                            errors.price = "Price is not valid!"
                        }

                        return errors;
                    }}
                    onSubmit={async (values, { resetForm }) => {

                        if (!imgRef.current.value) {
                            toast.error("Please upload an image :(((");
                            return;
                        }

                        setLoading(true);

                        await sleep(200)

                        axios.post("/api/food", { data: { name: values.foodName, price: values.price, img } })
                            .then(res => {
                                getFoods();
                                imgRef.current.value = null;
                                resetForm()
                                toast.success("SUCCESS : )))")
                                setLoading(false);
                            }).catch(error => {
                                toast.error(error.response?.data?.message || "ERROR :((")
                                setLoading(false);
                            })


                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="lg:flex items-end justify-between">
                                <div className="lg:w-[250px]">
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
                                </div>
                                <div className="lg:w-[250px]">
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
                                </div>
                                <input className="input-file mt-4" type="file" onChange={(e) => readURL(e, setImg)} ref={imgRef} />
                            </div>

                            <div className="flex justify-center mt-8">
                                <button type="submit" className="btn w-[250px] mt-6">
                                    <span className="right"></span>
                                    <span className="left"></span>
                                    Add food
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="text-center py-3">
                                Number
                            </th>
                            <th scope="col" class="text-center py-3">
                                Food image
                            </th>
                            <th scope="col" class="text-center py-3">
                                Product name
                            </th>
                            <th scope="col" class="text-center py-3">
                                Price
                            </th>
                            <th scope="col" class="text-center py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            foodsList.map((food, i) => <tr class="odd:bg-zinc-700 odd:dark:bg-gray-900 even:bg-zinc-800 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th className="text-center text-white py-4">
                                    {i + 1}
                                </th>
                                <td class="text-center py-4">
                                    <div className="flex justify-center">
                                        <img src={food.img} width="80px" style={{ height: "80px", objectFit: "cover" }} />
                                    </div>
                                </td>
                                <th scope="row" class="text-center text-white py-4 font-medium whitespace-nowrap dark:text-white">
                                    {food.name}
                                </th>

                                <td class="text-center text-white py-4">
                                    {food.price}
                                </td>
                                <td class="text-center text-white py-4">
                                    <a
                                        href="#"
                                        className="bg-yellow-400 rounded-md px-4 py-2 transition-all text-black hover:bg-yellow-500"
                                        onClick={async () => {
                                            setSelectedFood(food)
                                            setOpenEditBox(true)
                                        }}>Edit</a>

                                    <a href="#" className="bg-red-500 rounded-md px-4 py-2 transition-all text-black hover:bg-red-600 mx-2" onClick={() => {
                                        Swal.fire({
                                            title: 'DELETE!',
                                            text: `Are you sure about delete "${food.name}" ?`,
                                            icon: 'error',
                                            showCancelButton: true,
                                            reverseButtons: true,
                                            allowEnterKey: true,
                                            cancelButtonText: "Cancel",
                                            confirmButtonText: 'Delete'
                                        }).then(async (res) => {
                                            if (res.isConfirmed) {
                                                setLoading(true);

                                                await sleep(200);

                                                axios.delete("/api/food", { params: { id: food._id } })
                                                    .then(res => {
                                                        setLoading(false);
                                                        getFoods();
                                                        toast.success("SUCCESS : )))")
                                                    }).catch(error => {
                                                        toast.error(error.response?.data?.message || "ERROR :((")
                                                        setLoading(false);
                                                    })
                                            }
                                        })
                                    }}>Delete</a>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>

        </PAdminLayout>
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