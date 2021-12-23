import React, { useState, useEffect, useCallback } from "react";
import { Row, Spin, Button, message, Popconfirm, PageHeader, Statistic, Divider } from 'antd';
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import { useRouter } from "next/router";
import * as patientApi from "./PatientApi";
import useTranslation from 'next-translate/useTranslation'
import moment from "moment";

export default function PatientDetails(){
    const router = useRouter();
    const { id } = router.query;
    const [isCanceled, setisCanceled] = useState(false);
    const [isUpdated, setisUpdated] = useState(false);
    const [patient, setpatient] = useState<any>(undefined);
    const [loading, setloading] = useState(false)
    const { t } = useTranslation('ns1');

    const getpatient =  useCallback (async () => {
          try {
            if(typeof(id) === "string") {
              setloading(true);
              const response: any = await patientApi.getPatient(id);
              setpatient(response);
            }
          } catch(error: any) {
            message.error(error?.message);
            router.push(`/patient`)
          } finally {
            setloading(false);
          }
    },[id]);

    useEffect(() => {
      getpatient();
    }, [getpatient]);

    const handleActiveStatus =  useCallback (async () => {
        try {
            if(typeof(id) === "string") {
              setloading(true);
              const response: any = await patientApi.activePatient(id);
              setpatient(response);
            }
          } catch(error: any) {
            message.error(error?.message);
          } finally {
            setloading(false);
          }
    },[id]);


    const handleInActiveStatus =  useCallback (async () => {
        try {
            if(typeof(id) === "string") {
              setloading(true);
              const response: any = await patientApi.deletePatient(id);
              setpatient(response);
            }
          } catch(error: any) {
            message.error(error?.message);
          } finally {
            setloading(false);
          }
    },[id]);

    return (
     <ErrorBoundary FallbackComponent={ErrorFallback}>
         <Spin spinning={loading || isCanceled || isUpdated}>
           {
             !loading && patient && 
           
            <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={patient?.name}
            extra={[
                <Popconfirm
                title={t("form:statusConfirmation")}
                okText={t("form:yes")}
                cancelText={t("form:no")}
                onConfirm={patient?.is_active ? handleInActiveStatus : handleActiveStatus}
              >
                <Button key="1" ghost danger>
                    { patient?.is_active ?  t("form:inactive") : t("form:active")}
                </Button> 
              </Popconfirm>,
            ]}
          >
            <Divider />

            <Row justify="space-between">
                <Statistic groupSeparator='' title={t("table:phone")} value={patient?.phone} />
                <Statistic title={t("form:gender")} value={t(`form:${patient?.gender}`)} />
                <Statistic title={t("form:email")} value={patient?.email} />
                <Statistic title={t("form:profileUpdated")}  value={patient?.is_update_profile ? t("form:yes") : t("form:no")} />
                <Statistic title={t("table:actveStatus")} value={patient?.is_active ? t("form:active") : t("form:inactive")} />
            </Row>

            <Divider />

            <Row justify="space-between">
                <Statistic title={t("form:city")} value={patient?.city} />
                <Statistic title={t("form:upazila")} value={patient?.thana} />
                <Statistic title={t("form:postcode")} value={patient?.post_code} />
                <Statistic title={t("form:address")} value={patient?.street} />
            </Row>
            <Divider />
            <Row justify="space-between">
                <Statistic title={t("form:createdAt")} value={moment(patient?.createdAt).format('MMMM Do YYYY, h:mm:ss a')} />
                <Statistic title={t("form:updatedAt")} value={moment(patient?.updatedAt).format('MMMM Do YYYY, h:mm:ss a')} />
            </Row>
          </PageHeader>
            }
         </Spin>
      </ErrorBoundary>
    )
 } 
 