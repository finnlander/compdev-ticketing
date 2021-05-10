import axios from 'axios';

function isServerSide() {
    return typeof window === 'undefined';
}

// [kubernatesServiceName].[kubernatesNamespace].svc.cluster.local
const serverSideBaseUrl = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';

const buildClient = ({ req }) => {
    console.log('ServerSide: ', isServerSide());

    if (isServerSide()) {
        return axios.create({
            baseURL: serverSideBaseUrl,
            headers: req.headers
        });
    }

    return axios.create({
        baseURL: '/'
    });
};

export default buildClient;