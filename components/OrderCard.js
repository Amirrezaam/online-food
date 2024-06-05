import styles from '@/styles/OrderCard.module.css'

export default function OrderCard({ name, price, img, count, food, decrementOrder, incrementOrder }) {

    return (
        <div className={styles.order_card}>
            <img src={img} />
            <span>{name}</span>

            <span>{price}</span>
            <div>
                <button className="btn" onClick={() => incrementOrder(food)}>+</button>
                <span>{count}</span>
                <button className="btn" onClick={() => decrementOrder(food)}>-</button>
            </div>
        </div>
    )
}
