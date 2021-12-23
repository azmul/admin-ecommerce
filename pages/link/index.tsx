import Head from 'next/head'
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from 'next/router';
import Link from "../../app/components/link/Link";

export default function LinkPage() {
  const router = useRouter();
  const role = useSelector(
    (state: RootState) => state.authModel.role
  );
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
        <title>Link Page</title>
      </Head>
      <Link />
    </>
  )
}