import { SpinnerCircular } from 'spinners-react';

import styles from "@/styles/Loader.module.css"
import { mainOrangeColor } from '@/helper/constants';

export default function Loader({ className }) {
    return (
        <div className={`${styles.loader} ${className}`}>
            <SpinnerCircular
                size={50}
                thickness={180}
                speed={136}
                color={mainOrangeColor}
                secondaryColor="rgba(0, 0, 0, 1)"
            />
        </div>
    )
}