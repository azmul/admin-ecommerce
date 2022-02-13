import Head from 'next/head'
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useRouter } from 'next/router';
import Products from "app/components/products/Products";

export default function ProductsPage() {
  const router = useRouter();
  /** Start Page Access Check */
    const token = useSelector(
      (state: RootState) => state.authModel.token
    );
    if(!token) {
      router.push('/login');
      return<></>;
    };
  /** End Page Access Check */

  return (
    <>
      <Head>
        <title>Products Page</title>
      </Head>
      <Products />
    </>
  )
}