import React, { useState, useEffect, useCallback } from "react";
import {message, Table, Button, Card, Form, Input} from 'antd';
import * as homeopathyApi from "./HomeopathyApi";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import Link from "next/link";
import { useRouter } from 'next/router';
import styles from "./Styles.module.scss";
import { UserOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation'

export default function DoctorList() {
  const router = useRouter();
   const [doctors, setDoctors] = useState([]);
   const [loadingDoctors, setloadingDoctors] = useState<boolean>(false);
   const [pagination, setpagination] = useState({})
   const [form] = Form.useForm();
   const { t } = useTranslation('ns1');

   const columns: any = [
    {
      title:  t("table:doctorId"),
      dataIndex: 'numeric_id',
      key: 'numeric_id',
      render: (date: string, record: any) => <Link href={`/homeopathy/doctors/${record.numeric_id}`}>{record?.numeric_id}</Link> 
    },
    {
      title: t("table:name"),
      dataIndex: 'name',
      key: 'name',
      render: (date: string, record: any) => <Link href={`/homeopathy/doctors/${record.numeric_id}`}>{record?.name}</Link> 
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
      title: t("form:registerNumber"),
      dataIndex: 'register_number',
      key: 'register_number',
    },
    {
      title: t("form:fee"),
      dataIndex: 'fees',
      key: 'fees',
    },
    {
      title:  t("table:actveStatus"),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (date: string, record: any) => record?.is_active ? t("table:active") : t("table:inactive")
    }
    
  ];

   const getDoctors = useCallback(
       async (params?: any) => {

         if(params &&  params?.total) {
           delete params.total;
         }   
         
           try {
            setloadingDoctors(true);
             const response: any = await homeopathyApi.getHomeopathyDoctors({ ...params});
             setDoctors(response?.data);
             setpagination(response?.pagination)
           } catch(error: any) {
             message.error(error?.message);
           } finally {
            setloadingDoctors(false);
           }
       },[],
   )

   useEffect(() => {
    getDoctors();
   },[getDoctors])

   const onFinish = (values: any) => {
    if(values?.id) {
      router.push(`/homeopathy/doctors/${values?.id}`)
      }
    }

   return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Card title={t("doctor:doctorList")}>
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
              {t("table:find")}
            </Button>
          </Form.Item>
        </Form>
           <Table onChange={getDoctors} pagination={pagination} loading={loadingDoctors} columns={columns} dataSource={doctors} />
         </Card>
      </ErrorBoundary>
   )
} 
