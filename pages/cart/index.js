import Navbar from '@/components/Navbar'
import serverProps from '@/lib/serverProps.js'
import connectToDB from "@/configs/db";
import styles from '@/styles/Cart.module.css'
import OrdersModel from '@/models/Orders.js'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { sleep } from '@/utils/helper';
import Loader from '@/components/Loader';

export default function Cart({ name, number,role, order, sumPrice, countOrders }) {

    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState(order);
    const [sumOfPrices, setSumOfPrices] = useState(sumPrice);
    const [countOfOrders, setCountOfOrders] = useState(countOrders)


    const getOrders = () => {

        setLoading(true);

        axios.get("/api/order")
            .then(res => {
                setLoading(false);
                setOrders(res.data.orders);
                setSumOfPrices(res.data.sumPrice);
                setCountOfOrders(res.data.countOrders)
            }).catch(err => {
                setLoading(false);
                toast.error(err.response?.data?.message || "ERROR :((")
            })
    }

    const decrementOrder = async (_id) => {

        setLoading(true);
        await sleep(200);

        axios.put("/api/order", { info: { _id, action: "DEC" } })
            .then(res => {
                setLoading(false);
                getOrders();
            }).catch(err => {
                setLoading(false);
                toast.error(err.response?.data?.message || "ERROR :((")
            })
    }

    const incrementOrder = async (_id) => {

        setLoading(true);
        await sleep(200);

        axios.put("/api/order", { info: { _id, action: "INC" } })
            .then(res => {
                setLoading(false);
                getOrders();
            }).catch(err => {
                setLoading(false);
                toast.error(err.response?.data?.message || "ERROR :((")
            })
    }

    return (
        <>
            {loading && <Loader />}
            <Navbar name={name} number={number} role={role} countOfOrders={countOfOrders} />
            <div className="flex justify-center my-5">
                <div className="container">
                    <div className="md:flex items-start">
                        <div className={styles.order_card_box}>

                            <div class="relative overflow-x-auto shadow-md rounded-lg">
                                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="text-center py-3">
                                                Food image
                                            </th>
                                            <th scope="col" class="text-center py-3">
                                                food name
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
                                            orders.map(order => <tr class="odd:bg-zinc-700 odd:dark:bg-gray-900 even:bg-zinc-800 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                                <td class="text-center py-4">
                                                    <div className="flex justify-center">
                                                        <img src={order.img} width="80px" style={{ height: "80px", objectFit: "cover" }} />
                                                    </div>
                                                </td>
                                                <th scope="row" class="text-center text-white py-4 font-medium whitespace-nowrap dark:text-white">
                                                    {order.name}
                                                </th>

                                                <td class="text-center py-4 text-white">
                                                    {order.price}
                                                </td>
                                                <td class="px- py-4">

                                                    <div className="flex items-center justify-center">
                                                        <button className="btn" onClick={() => incrementOrder(order.food)}>
                                                            <span className="right"></span>
                                                            <span className="left"></span>
                                                            +
                                                        </button>
                                                        <span className="px-3 text-white">{order.count}</span>
                                                        <button className="btn" onClick={() => decrementOrder(order.food)}>
                                                            <span className="right"></span>
                                                            <span className="left"></span>
                                                            -
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={`${styles.cart_box} mt-4 md:mt-0`}>
                            <p className="my-6 text-white text-center">Count of orders : {countOfOrders}</p>
                            <p className="my-6 text-white text-center">Sum of prices : {sumOfPrices}</p>
                            <button className="btn" disabled={!countOfOrders} onClick={async () => {
                                setLoading(true);
                                await sleep(200);
                                axios.post("/api/payment")
                                    .then(res => {
                                        setLoading(false);
                                        setCountOfOrders(0)
                                        getOrders()
                                        toast.success("Your order has been registered")
                                    }).catch(err => {
                                        setLoading(false);
                                        toast.error(err.response?.data?.message || "ERROR :((")
                                    })
                            }} style={{ width: "100%",cursor: countOfOrders ? "pointer" : "not-allowed" }}>
                                <span className="right"></span>
                                <span className="left"></span>
                                PAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const userLogin = await serverProps(ctx)

    if (!userLogin) {
        return {
            redirect: {
                destination: "/login"
            }
        }
    }

    connectToDB()

    const orders = await OrdersModel.find({ user: userLogin._id, isPayment: false });
    let countOrders = 0;
    let sumPrice = 0;
    orders.map(order => {
        sumPrice += order.price * order.count;
        countOrders += order.count;
    })

    return {
        props: {
            name: userLogin.name,
            number: userLogin.number,
            role: userLogin.role,
            order: JSON.parse(JSON.stringify(orders)),
            sumPrice,
            countOrders
        }
    };
}