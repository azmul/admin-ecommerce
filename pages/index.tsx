import Head from 'next/head'
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter } from 'next/router';
import { Card } from "antd";
import useTranslation from 'next-translate/useTranslation'
import HomePage from "../app/components/home";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
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
        <title>Home</title>
      </Head>
      <Card>
        <HomePage />
      </Card>
    </>
  )
}