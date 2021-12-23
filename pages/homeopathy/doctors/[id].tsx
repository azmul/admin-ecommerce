import Head from 'next/head'
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useRouter } from 'next/router';
import Doctor from "../../../app/components/homeopathy/Doctor";

export default function DoctorsPage() {
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
        <title>Doctors Page</title>
      </Head>
      <Doctor />
    </>
  )
}