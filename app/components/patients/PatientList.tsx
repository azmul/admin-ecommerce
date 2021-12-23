import React, { useState, useEffect, useCallback } from "react";
import {message, Table, Button, Card, Form, Input} from 'antd';
import * as patientApi from "./PatientApi";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import Link from "next/link";
import { useRouter } from 'next/router';
import styles from "./Styles.module.scss";
import { UserOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation'

export default function AppointmentListPatient() {
   const [patients, setPatients] = useState([]);
   const [loadingPatients, setloadingPatients] = useState<boolean>(false);
   const [pagination, setpagination] = useState({})
   const [form] = Form.useForm();
   const router = useRouter();
   const { t } = useTranslation('ns1');

   const columns: any = [
    {
      title: t("table:id"),
      dataIndex: 'numeric_id',
      key: 'numeric_id',
      render: (date: string, record: any) => <Link href={`/patient/${record.numeric_id}`}>{record?.numeric_id}</Link> 
    },
    {
      title: t("table:name"),
      dataIndex: 'name',
      key: 'name',
      render: (date: string, record: any) => <Link href={`/patient/${record.numeric_id}`}>{record?.name}</Link> 
    },
    {
      title: t("table:phone"),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t("table:gender"),
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string, record: any) => t(`form:${gender}`) 
    },
    {
      title: t("table:actveStatus"),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (date: string, record: any) => record?.is_active ? t("table:active") : t("table:inactive")
    }
  ];

   const getPatients = useCallback(
       async (params?: any) => {

         if(params &&  params?.total) {
           delete params.total;
         }   
         
           try {
            setloadingPatients(true);
             const response: any = await patientApi.getPatients({ ...params});
             setPatients(response?.data);
             setpagination(response?.pagination)
           } catch(error: any) {
             message.error(error?.message);
           } finally {
            setloadingPatients(false);
           }
       },[],
   )

   useEffect(() => {
    getPatients();
   },[getPatients])

   const onFinish = (values: any) => {
    if(values?.id) {
      router.push(`/patient/${values?.id}`)
      }
    }


   return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Card title={t("patient:patientList")}>
        <Form className={styles.searchForm} form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
          <Form.Item
            name="id"
            rules={[{ required: true, message: t("table:appointmentIdVerification") }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t("table:appointmentId")} />
          </Form.Item>
          <Form.Item >
            <Button
              type="primary"
              htmlType="submit"
            >
              {t("table:find") }
            </Button>
          </Form.Item>
        </Form>
        <Table onChange={getPatients} pagination={pagination} loading={loadingPatients} columns={columns} dataSource={patients} />
         </Card>
      </ErrorBoundary>
   )
} 
