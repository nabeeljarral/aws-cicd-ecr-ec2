import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {ThemeProvider} from '@mui/material';
import {theme} from '@/utils/theme';
import {persistor, store} from '@/store';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/transaction.css';
import '@/styles/transactionOld.css';
import Head from 'next/head';


function MyApp({Component, pageProps}: AppProps) {
    return (
        <>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                    <ToastContainer />
                </ThemeProvider>
            </PersistGate>
        </Provider>
     </>
    );
}

export default MyApp;