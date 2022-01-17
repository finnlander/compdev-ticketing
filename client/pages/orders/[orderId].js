import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
    const stripePublishableKey =
        'pk_test_51IluTbEpm0QMyr3DG2p6tb6u5Def0bRctSQsOxLybHyQ1vAONcevU0i5j5jdIhsCwU5nbL9lNPCXjSLVVjzpF1S8000R5Neo96';
    const [timeLeft, setTimeLeft] = useState(0);
    const router = useRouter();
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: (payment) => router.push('/orders'),
    });

    useEffect(() => {
        const calcTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.max(0, Math.round(msLeft / 1000)));
        };

        calcTimeLeft();
        const timerId = setInterval(calcTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if (timeLeft <= 0) {
        return <div>Order Expired</div>;
    }

    const onTokenRecieved = async (token) => {
        const { id } = token;
        doRequest({ token: id });
    };

    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <StripeCheckout
                token={(token) => onTokenRecieved(token)}
                stripeKey={stripePublishableKey}
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
};

OrderShow.getInitialProps = async (ctx, client) => {
    const { orderId } = ctx.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
};

export default OrderShow;
