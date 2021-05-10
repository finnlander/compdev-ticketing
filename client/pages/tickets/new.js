import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRequest } from '../../hooks/use-request';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const router = useRouter();
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: (ticket) => router.push('/')
    });

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    };

    const onBlur = () => {
        const value = parseFloat(price);
        if (Number.isNaN(value)) {
            setPrice((0.00).toFixed(2));
            return;
        }

        setPrice(value.toFixed(2));
    }

    return (
        <div>
            <h1>Create a new ticket</h1>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label>Title</label>
                    <input className='form-control'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label>Price</label>
                    <input className='form-control'
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {errors}
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>

    );
};

export default NewTicket;