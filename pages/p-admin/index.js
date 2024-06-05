import PAdminLayout from '@/components/layouts/PAdminLayout';
import serverProps from '@/lib/serverProps.js'
import styles from '@/styles/PAdmin.module.css'

export default function PAdmin({name}) {
    return (
        <PAdminLayout>
            <div className="flex h-[95vh] justify-center items-center text-4xl text-white">
                WELCOME {name}
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

    return {
        props: {
            name: userLogin.name
        }
    };
}