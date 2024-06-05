import styles from '@/styles/FoodCard.module.css'

export default function FoodCard({ name, price, img, _id, incrementOrder, decrementOrder, inCart, addToCart, orders }) {

    return (
        <>
            <div className={styles.food_card}>
                <div className={styles.img_box} style={{ width: "100%", height: "300px" }}>
                    <img src={img} />

                    <div>
                        <div className={styles.food_info}>
                            <span>{name}</span>
                            <p>{price} $</p>
                        </div>

                        {
                            inCart ?
                                <div className={styles.btn_container}>
                                    <div className={styles.btns}>
                                        <button className="btn" onClick={() => decrementOrder(_id)}>
                                            <span class="right"></span>
                                            <span class="left"></span>
                                            -
                                        </button>
                                        <span className="mx-4">{orders?.filter(order => order.food === _id).map(order => order.count)}</span>
                                        <button className="btn" onClick={() => incrementOrder(_id)}>
                                            <span class="right"></span>
                                            <span class="left"></span>
                                            +
                                        </button>
                                    </div>
                                </div> :
                                <div className={styles.btn_container}>
                                    <button className="btn" onClick={() => addToCart({ _id, name, img, price })}>
                                        <span class="right"></span>
                                        <span class="left"></span>
                                        Add to cart
                                    </button>
                                </div>
                        }
                    </div>
                </div>


            </div>
        </>
    )
}
