import React, { useState, useEffect, useCallback } from "react";
import { Spin, Button, message, Popconfirm, PageHeader, Statistic, Row, Divider } from 'antd';
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import { useRouter } from "next/router";
import * as ayurvedicApi from "./AyurvedicApi";
import useTranslation from 'next-translate/useTranslation'
import moment from "moment";

export default function AyurvedicDoctorDetails(){
    const router = useRouter();
    const { id } = router.query;
    const [isCanceled, setisCanceled] = useState(false);
    const [isUpdated, setisUpdated] = useState(false);
    const [doctor, setdoctor] = useState<any>(undefined);
    const [loading, setloading] = useState(false)
    const { t } = useTranslation('ns1');

    const getdoctor = async () => {
          try {
            if(typeof(id) === "string") {
              setloading(true);
              const response: any = await ayurvedicApi.getAyurvedicDoctor(id);
              setdoctor(response);
            }
          } catch(error: any) {
            message.error(error?.message);
            router.push(`/ayurvedic/doctors`)
          } finally {
            setloading(false);
          }
        }

    useEffect(() => {
      getdoctor();
    }, [id]);

    const handleActiveStatus =  useCallback (async () => {
      try {
          if(typeof(id) === "string") {
            setloading(true);
            const response: any = await ayurvedicApi.activeDoctor(id);
            setdoctor(response);
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
            const response: any = await ayurvedicApi.deleteDoctor(id);
            setdoctor(response);
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
             !loading && doctor && 
             <PageHeader
             ghost={false}
             onBack={() => window.history.back()}
             title={doctor?.name}
             extra={[
                 <Popconfirm
                 title={t("form:statusConfirmation")}
                 okText={t("form:yes")}
                 cancelText={t("form:no")}
                 onConfirm={doctor?.is_active ? handleInActiveStatus : handleActiveStatus}
               >
                 <Button key="1" ghost danger>
                     { doctor?.is_active ?   t("form:inactive") : t("form:active")}
                 </Button> 
               </Popconfirm>,
             ]}
           >
             <Divider />
 
             <Row justify="space-between">
             <Statistic groupSeparator=''  title={t("table:phone")}  value={doctor?.phone} />
                <Statistic title={t("form:gender")} value={t(`form:${doctor?.gender}`)} />
                <Statistic title={t("form:email")} value={doctor?.email} />
                <Statistic title={t("form:profileUpdated")} value={doctor?.is_update_profile ? t("form:yes") : t("form:no")} />
                <Statistic title={t("table:actveStatus")} value={doctor?.is_active ? t("form:active") : t("form:inactive")} />
             </Row>
 
             <Divider />
 
             <Row justify="space-between">
                <Statistic title={t("form:city")} value={doctor?.city} />
                <Statistic title={t("form:upazila")} value={doctor?.thana} />
                <Statistic title={t("form:postcode")} value={doctor?.post_code} />
                <Statistic title={t("form:address")} value={doctor?.street} />
            </Row>
            <Divider />
            <Row justify="space-between">
                <Statistic title={t("form:createdAt")} value={moment(doctor?.createdAt).format('MMMM Do YYYY, h:mm:ss a')} />
                <Statistic title={t("form:updatedAt")} value={moment(doctor?.createdAt).format('MMMM Do YYYY, h:mm:ss a')} />
            </Row>
            
           </PageHeader>
            }
         </Spin>
      </ErrorBoundary>
    )
 } 
 