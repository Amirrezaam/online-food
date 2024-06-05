import Image from "next/image";
import { Inter } from "next/font/google";
import serverProps from '@/lib/serverProps.js'
import FoodCard from "@/components/FoodCard";
import Navbar from "@/components/Navbar";
import styles from '@/styles/Home.module.css'
import FoodModel from '@/models/Food.js'
import connectToDB from "@/configs/db";
import OrdersModel from '@/models/Orders.js'
import { useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import { sleep } from "@/utils/helper";
import { toast } from "react-toastify";

export default function Home({ name, number, role, foods, orders: allOrders, countOrders }) {

  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(allOrders);
  const [countOfOrders, setCountOfOrders] = useState(countOrders)

  const getOrders = async () => {
    setLoading(true)

    axios.get("/api/order")
      .then(res => {

        setOrders(res.data.orders)
        setCountOfOrders(res.data.countOrders)
        setLoading(false)
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
        getOrders();
        setLoading(false)
      }).catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message || "ERROR :((")
      })
  }

  const incrementOrder = async (_id) => {
    setLoading(true)
    await sleep(200);

    axios.put("/api/order", { info: { _id, action: "INC" } })
      .then(res => {
        getOrders();
        setLoading(false)
      }).catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message || "ERROR :((")
      })
  }

  const addToCart = async (food) => {
    setLoading(true);
    await sleep(200);

    axios.post("/api/order", { food })
      .then(res => {
        getOrders();
        setLoading(false)
      }).catch(err => {
        setLoading(false);
        toast.error(err.response?.data?.message || "ERROR :((")
      })
  }

  return (
    <>
      {
        loading && <Loader />
      }
      <Navbar name={name} number={number} role={role} countOfOrders={countOfOrders} />
      <div className="flex justify-center my-5">
        <div className="container">
          <div className={styles.container}>
            {
              console.log(orders)
            }
            {
              foods.map(food => <FoodCard
                {...food}
                orders={orders}
                decrementOrder={decrementOrder}
                incrementOrder={incrementOrder}
                addToCart={addToCart}
                inCart={orders.some(order => order.food === food._id)}
              />
              )
            }
          </div>
        </div>
      </div>
    </>
  );
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

  connectToDB();

  const foods = await FoodModel.find({});
  const orders = await OrdersModel.find({ user: userLogin._id, isPayment: false });
  let countOrders = 0;
  orders.map(order => countOrders += order.count)

  return {
    props: {
      name: userLogin.name,
      number: userLogin.number,
      role: userLogin.role,
      foods: JSON.parse(JSON.stringify(foods)),
      orders: JSON.parse(JSON.stringify(orders)),
      countOrders
    }
  };
}