import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Spin, Button, message, Popconfirm, PageHeader, Statistic, Divider, Row } from 'antd';
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import { useRouter } from "next/router";
import * as homeopathyApi from "./HomeopathyApi";
import useTranslation from 'next-translate/useTranslation'
import moment from "moment";

const AppointmentHomeopathyDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isCanceled, setisCanceled] = useState(false);
    const [isUpdated, setisUpdated] = useState(false);
    const [appointment, setappointment] = useState<any>(undefined);
    const [loading, setloading] = useState(false)
    const { t } = useTranslation('ns1');
    
    const getAppointment = async () => {
          try {
            if(typeof(id) === "string") {
              setloading(true);
              const response: any = await homeopathyApi.getHomeopathyAppointment(id);
              setappointment(response);
            }
          } catch(error: any) {
            message.error(error?.message)
            router.push("/homeopathy/appointments")
          } finally {
            setloading(false);
          }
        }

    useEffect(() => {
      getAppointment();
    }, [id]);

    const paymentComplete = async (payment: boolean) => {
        try {
            if(typeof(id) === "string") {
              setloading(true);
              await homeopathyApi.paymentHomeopathyAppointment(id, {is_payment_done: payment});
              const content = `Payment Updated`;

                message.success({
                    content,
                    style: {
                    marginTop: '20vh',
                    },
                    duration: 2,
                });
            }
          } catch(error: any) {
            message.error(error?.message);
          } finally {
            setloading(false);
          }
    }

    return (
     <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Spin spinning={loading || isCanceled || isUpdated}>
           {
             !loading && appointment && 
            <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={appointment?.numeric_id}
            extra={[
              <Popconfirm
                title={appointment?.is_payment_done ?  t("form:paymentConfirmationCancel") : t("form:paymentConfirmationDone")}
                onConfirm={() => appointment?.is_payment_done ? paymentComplete(false) : paymentComplete(true)}
                okText={t("form:yes")}
                cancelText={t("form:no")}
              >
                <Button danger ghost> { appointment?.is_payment_done ? t("form:paymentCancel") : t("form:paymentDone")}</Button>
              </Popconfirm>,
            ]}
          >
            <Divider />

            <Row justify="space-between">
                <Statistic title={t("form:doctor")} value={' '} prefix={<Link key={appointment?.doctor_numeric_id} href={`/homeopathy/doctors/${appointment?.doctor_numeric_id}`}><a>{appointment?.doctor_name}</a></Link>} />
                <Statistic groupSeparator='' title={t("table:doctorId")} value={appointment?.doctor_numeric_id} />
                <Statistic title={t("table:doctorFee")} value={appointment?.doctor_fees} />
            </Row>

            <Divider />

            <Row justify="space-between">
               <Statistic title={t("table:patient")} value={' '} prefix={<Link key={appointment?.patient_numeric_id} href={`/patient/${appointment?.patient_numeric_id}`}><a>{appointment?.patient_name}</a></Link> } />
               <Statistic groupSeparator='' title={t("table:patientId")} value={appointment?.patient_numeric_id} />
               <Statistic title={t("appointment:age")} value={appointment?.patient_age} />
               <Statistic title={t("appointment:gender")} value={t(`appointment:${appointment?.patient_gender}`)} />
               <Statistic title={t("appointment:patientType")} value={t(`appointment:${appointment?.patient_type}`)} />
            </Row>

            <Divider />

            <Row justify="space-between">
               <Statistic title={t("form:createdAt")} value={moment(appointment?.created_at).format('LL')} />
                <Statistic title={t("appointment:time")} value={appointment?.time_slot} />
                <Statistic title={t("appointment:medicineShipingStatus")} value={appointment?.medicine_shipping_status || 'N/A'} />
            </Row>

            <Divider />

            <Row justify="space-between">
                <Statistic title={t("appointment:paymentOptionType")} value={appointment?.payment_method === 1 ? t(`appointment:bkash`) : appointment?.payment_method === 2 ? t(`appointment:nagad`) : t(`appointment:rocket`)} />
                <Statistic groupSeparator='' title={t("appointment:tranctionId")} value={appointment?.transaction_id} />
              </Row>
            </PageHeader>
            
            }
         </Spin>
      </ErrorBoundary>
    )
 } 
 
 export default AppointmentHomeopathyDetails;