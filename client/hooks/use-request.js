import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const createErrorBlock = (errs) => {
        if (errs.length === 0) {
            return null;
        }

        return (
            <div className="alert alert-danger">
                <h4>Oops...</h4>
                <ul className="my-0">
                    {errs.map(err => <li key={err.message}>{err.message}</li>)}
                </ul>
            </div>
        );
    }

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const constructedBody = { ...body, ...props };
            const response = await axios[method](url, constructedBody);

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;

        } catch (err) {
            const errorArray = err?.response?.data?.errors || [];
            if (errorArray.length == 0) {
                console.log('Error without info: ', err);
            }
            const jsxElem = createErrorBlock(errorArray);
            setErrors(jsxElem);
        }

    };

    return { doRequest, errors };
};

export { useRequest };
