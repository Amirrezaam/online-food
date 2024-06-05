import PAdminLayout from '@/components/layouts/PAdminLayout'
import serverProps from '@/lib/serverProps.js'
import { useState } from 'react'
import OrdersModel from '@/models/Orders.js'
import UsersModel from '@/models/User.js'
import connectToDB from '@/configs/db';
import styles from '@/styles/PAdminOrders.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function Orders({ classifiedOrders }) {

    const [ordersList, setOrdersList] = useState(classifiedOrders);
    const [openDetailsBox, setOpenDetailsBox] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    return (
        <PAdminLayout>
            <>
                <div
                    className={styles.details_box}
                    style={{ top: openDetailsBox ? 0 : "-100%" }}
                >
                    <div className="text-right">
                        <button className="m-3" onClick={() => setOpenDetailsBox(false)}>
                            <FontAwesomeIcon icon={faClose} className="fas fa-check" style={{ color: "#fff", fontSize: "22px" }}></FontAwesomeIcon>
                        </button>
                    </div>
                    <div className="p-5">
                        <div className="rounded-lg overflow-hidden">
                            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" class=" py-3">
                                        </th>
                                        <th scope="col" class="text-center py-3">
                                            Food image
                                        </th>
                                        <th scope="col" class="text-center py-3">
                                            Food name
                                        </th>
                                        <th scope="col" class="text-center py-3">
                                            count
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedOrder?.map((order, i) => <tr class="odd:bg-zinc-700 odd:dark:bg-gray-900 even:bg-zinc-800 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td scope="row" class="text-center text-white py-4 font-medium">
                                                {i + 1}
                                            </td>
                                            <td class="text-center text-white py-4">
                                                <div className="flex justify-center">
                                                    <img src={order.img} width="80px" style={{ height: "80px", objectFit: "cover" }} />
                                                </div>
                                            </td>
                                            <th scope="row" class="text-center text-white py-4 font-medium whitespace-nowrap dark:text-white">
                                                {order.name}
                                            </th>

                                            <td class="text-center text-white py-4">
                                                {order.count}
                                            </td>

                                        </tr>)
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="text-center py-3">
                                    Number
                                </th>
                                <th scope="col" class="text-center py-3">
                                    User name
                                </th>
                                <th scope="col" class="text-center py-3">
                                    User number
                                </th>
                                <th scope="col" class="text-center py-3">

                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                ordersList.map((order, i) => <tr class="odd:bg-zinc-700 odd:dark:bg-gray-900 even:bg-zinc-800 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td class="text-center text-white py-4">
                                        {i + 1}
                                    </td>
                                    <th scope="row" class="text-center text-white py-4 font-medium whitespace-nowrap dark:text-white">
                                        {order.user.name}
                                    </th>

                                    <td class="text-center text-white py-4">
                                        {order.user.number}
                                    </td>

                                    <td class="text-center py-4">
                                        <button className="btn" onClick={() => {
                                            setSelectedOrder(order.orders);
                                            setOpenDetailsBox(true)
                                        }}>
                                            <span className="right"></span>
                                            <span className="left"></span>
                                            Details
                                        </button>
                                    </td>

                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </>
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

    let classifiedOrders = new Array();

    const orders = await OrdersModel.find({ isPayment: true });

    const groupByUser = orders.reduce((group, order) => {
        const { user } = order;
        group[user] = group[user] ?? [];
        group[user].push(order);
        return group;
    }, {})

    for (let i = 0; i < Object.keys(groupByUser).length; i++) {
        const element = Object.keys(groupByUser)[i];
        const user = await UsersModel.find({ _id: element });
        classifiedOrders.push({ user: user[0], orders: groupByUser[element] })
    }

    return {
        props: {
            classifiedOrders: JSON.parse(JSON.stringify(classifiedOrders)),
        }
    };
}