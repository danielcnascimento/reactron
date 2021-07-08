import { Header } from '../components/Header';

import { Provider as NextAuthProvider } from 'next-auth/client';
import { AppProps } from 'next/app';

import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.isUserLogged}>
      <Header />
      <Component {...pageProps} /> 
    </NextAuthProvider>
  )
}

export default MyApp
