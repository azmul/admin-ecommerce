import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from "../app/components/layout/Layout";
import NProgress from 'nprogress';
import Router from 'next/router';
import { Provider } from "react-redux";
import store from "../redux/store";
import "nprogress/nprogress.css";
import { getPersistor } from "@rematch/persist";
import { PersistGate } from "redux-persist/integration/react";
import { PreloadScreen } from "../app/components/ui/preload/PreloadScreen";
require('isomorphic-fetch');

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const persistor = getPersistor();

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
      <PersistGate
  loading={<PreloadScreen />}
  persistor={persistor}
>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </PersistGate>
  </Provider>

}
export default MyApp;
