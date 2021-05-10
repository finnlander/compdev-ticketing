// note: in next.js the global css needs to be imported in _app.js 
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';


const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className='container'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');
    const component = appContext.Component;
    let pageProps = {};
    if (component.getInitialProps) {
        pageProps = await component.getInitialProps(
            appContext.ctx,
            client,
            data.currentUser
        );
    }

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;