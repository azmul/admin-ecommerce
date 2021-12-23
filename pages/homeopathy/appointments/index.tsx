import Head from 'next/head'
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useRouter } from 'next/router';
import HomeopathyAppointments from '../../../app/components/homeopathy/AppoiintmentList';
import { Tabs, Card } from 'antd';
import useTranslation from 'next-translate/useTranslation'

const { TabPane } = Tabs;

export default function HomeopathyAppointmentsPage() {
  const { t } = useTranslation('ns1');
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
        <title>Homeopathy Appointments</title>
      </Head>
      <Card>      
        <Tabs defaultActiveKey="1">
        <TabPane tab={t("table:paymentPending")} key="1">
           <HomeopathyAppointments payment={false} />
        </TabPane>
        <TabPane tab={t("table:paymentDone")} key="2">
           <HomeopathyAppointments payment={true} />
        </TabPane>
      </Tabs>
      </Card>

    </>
  )
}