/* eslint-disable react/display-name */
import React, { useState, useEffect, useCallback } from "react";
import {
  message,
  Table,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
} from "antd";
import * as homeopathyApi from "./HomeopathyApi";
import moment from "moment";
import { AppointmentType } from "./HomeopathyType";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../ui/ErrorFallback";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import styles from "./Styles.module.scss";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

type Props = {
  payment: boolean;
};

const AppointmentListPatient = ({ payment }: Props) => {
  const [appointments, setappointments] = useState([]);
  const [loadingAppointments, setloadingAppointments] =
    useState<boolean>(false);
  const [pagination, setpagination] = useState({});
  const [form] = Form.useForm();
  const router = useRouter();
  const { t } = useTranslation("ns1");
  const [slectedDate, setSelectedDate] = useState("");

  const columns: any = [
    {
      title: t("table:appointmentId"),
      dataIndex: "numeric_id",
      key: "numeric_id",
      render: (date: string, record: AppointmentType) => (
        <Link
          key={record?.numeric_id}
          href={`/homeopathy/appointments/${record?.numeric_id}`}
        >
          <a>{record?.numeric_id}</a>
        </Link>
      ),
    },
    {
      title: t("table:doctor"),
      dataIndex: "doctor_name",
      key: "doctor_name",
      render: (date: string, record: AppointmentType) => (
        <Link
          key={record?.doctor_numeric_id}
          href={`/homeopathy/doctors/${record?.doctor_numeric_id}`}
        >
          <a>{record?.doctor_name}</a>
        </Link>
      ),
    },
    {
      title: t("table:doctorId"),
      dataIndex: "doctor_numeric_id",
      key: "doctor_numeric_id",
    },
    {
      title: t("table:patient"),
      dataIndex: "patient_name",
      key: "patient_name",
      render: (date: string, record: AppointmentType) => (
        <Link
          key={record?.patient_numeric_id}
          href={`/patient/${record?.patient_numeric_id}`}
        >
          <a>{record?.patient_name}</a>
        </Link>
      ),
    },
    {
      title: t("table:patientId"),
      dataIndex: "patient_numeric_id",
      key: "patient_numeric_id",
    },
    {
      title: t("table:date"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string, record: AppointmentType) =>
        record.is_cancel ? (
          <del>{moment(date).format("LL")}</del>
        ) : (
          moment(date).format("LL")
        ),
    },
    {
      title: t("table:time"),
      dataIndex: "time_slot",
      key: "time_slot",
      render: (time: string, record: AppointmentType) =>
        record.is_cancel ? <del>{time}</del> : time,
    },
  ];

  const homeopathyAppointments = useCallback(
    async (params?: any) => {
      const query = { ...params };

      if (query && query?.total) {
        delete query.total;
      }
      if (slectedDate) {
        query.created_at = slectedDate;
      }

      try {
        setloadingAppointments(true);
        const response: any = await homeopathyApi.getHomeopathyAppointments({
          ...query,
          is_payment_done: payment,
        });
        setappointments(response?.data);
        setpagination(response?.pagination);
      } catch (error: any) {
        message.error(error?.message);
      } finally {
        setloadingAppointments(false);
      }
    },
    [payment, slectedDate]
  );

  useEffect(() => {
    homeopathyAppointments();
  }, [homeopathyAppointments]);

  const onFinish = (values: any) => {
    if (values?.id) {
      router.push(`/order/${values?.id}`);
    }
  };

  const appointmentsRefresh = () => {
    homeopathyAppointments();
  };

  const onDateChange = (date: any, dateString: string) => {
    setSelectedDate(dateString);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Row justify="space-between">
        <Col>
          <Form
            className={styles.searchForm}
            form={form}
            name="horizontal_login"
            layout="inline"
            onFinish={onFinish}
          >
            <Form.Item
              name="id"
              rules={[
                {
                  required: true,
                  message: t("table:appointmentIdVerification"),
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={t("table:appointmentId")}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {t("table:find")}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col>
          <DatePicker
            placeholder={t("table:appointmentDate")}
            onChange={onDateChange}
          />
          <Button
            onClick={appointmentsRefresh}
            loading={loadingAppointments}
            style={{ marginLeft: 10 }}
            type="primary"
          >
            {t("table:refresh")}
          </Button>
        </Col>
      </Row>

      <Table
        onChange={homeopathyAppointments}
        pagination={pagination}
        loading={loadingAppointments}
        columns={columns}
        dataSource={appointments}
      />
    </ErrorBoundary>
  );
};

export default AppointmentListPatient;
