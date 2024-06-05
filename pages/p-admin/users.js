import PAdminLayout from '@/components/layouts/PAdminLayout'
import serverProps from '@/lib/serverProps.js'
import axios from 'axios';
import { useState } from 'react'
import UsersModel from '@/models/User.js'
import connectToDB from '@/configs/db';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { sleep } from '@/utils/helper';
import Loader from '@/components/Loader';

export default function Users({ users }) {

    const [loading, setLoading] = useState(false)
    const [usersList, setUsersList] = useState(users);

    const getUsers = async () => {
        axios.get("/api/user")
            .then(res => {
                setUsersList(res.data.users)
            })
            .catch(err => {
                setLoading(false);
                toast.error(err.response?.data?.message || "ERROR :((")
            })
    }

    return (
        <PAdminLayout>
            <>
                {loading && <Loader />}
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
                                    Role
                                </th>

                                <th scope="col" class="text-center py-3">

                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                usersList.map((user, i) => <tr class="odd:bg-zinc-700 odd:dark:bg-gray-900 even:bg-zinc-800 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td class="text-center text-white py-4">
                                        {i + 1}
                                    </td>
                                    <th scope="row" class="text-center text-white py-4 font-medium whitespace-nowrap dark:text-white">
                                        {user.name}
                                    </th>

                                    <td class="text-center text-white py-4">
                                        {user.number}
                                    </td>

                                    <td class="text-center text-white py-4">
                                        {user.role}
                                    </td>

                                    <td class="text-center text-white py-4">
                                        {
                                            i !== 0 &&
                                            <a
                                                href="#"
                                                className="bg-blue-500 rounded-md px-4 py-2 transition-all text-black hover:bg-blue-600 mx-2"
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: `Change role for "${user.name}"`,
                                                        icon: "info",
                                                        input: "radio",
                                                        inputOptions: {
                                                            "ADMIN": "َAdmin",
                                                            "USER": "User"
                                                        },
                                                        inputValue: user.role,
                                                        cancelButtonText: "Cancel",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Apply",
                                                        reverseButtons: true
                                                    }).then(async (res) => {
                                                        if (res.isConfirmed) {

                                                            setLoading(true);
                                                            await sleep(200)

                                                            axios.put("/api/user", { _id: user._id, action: "CHANGE_ROLE", role: res.value })
                                                                .then(res => {
                                                                    getUsers();
                                                                    setLoading(false)
                                                                    toast.success("SUCCESS :)))")
                                                                }).catch(err => {
                                                                    setLoading(false);
                                                                    toast.error(err.response?.data?.message || "ERROR :((")
                                                                })
                                                        }
                                                    })
                                                }}>Change role</a>
                                        }
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

    const users = await UsersModel.find({})

    return {
        props: {
            users: JSON.parse(JSON.stringify(users)),
        }
    };
}