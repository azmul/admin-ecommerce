import React, { useState, useEffect, useCallback } from "react";
import {Card, message,  Button, DatePicker, Pagination, Row, Spin, Tooltip, Col, Input, Form} from 'antd';
import * as orderApi from "./OrderApi";
import moment from "moment";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import Link from "next/link";
import styles from "./Order.module.scss";
import useTranslation from 'next-translate/useTranslation'
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import { DELIVERY } from "../common/deliveryConst";
import { DateFormats } from "../../date/dateConst";
import { UserOutlined } from '@ant-design/icons';
import {useRouter} from "next/router"

export default function orderList() {
   const { t } = useTranslation('ns1');
   const [form] = Form.useForm();
   const router = useRouter();
   const [orders, setorders] = useState([]);
   const [loadingOrders, setloadingOrders] = useState<boolean>(false);
   const [pagination, setpagination] = useState<any>({})
   const [slectedDate, setSelectedDate] = useState('');

  const tableHeads = [
    {  title: t("table:orderId") },
    {  title: t("table:medicineList") },
    {  title: t("table:price") },
    {  title: t("table:payment") },
    {  title: t("table:delivaryStatus") },
    {  title: t("table:patient") },
    {  title: t("table:patientId")},
    {  title: t("table:phone")},
    {  title: t("table:createdAt")},
    {  title: t("table:updatedAt")},
    {  title: t("table:action")}
  ]

   const homeopathyorders = useCallback(
       async (page?: number) => {

             const query: any = {};

             if(slectedDate) {
              query.created_at = slectedDate;
             }

              if(page) {
                query.current = page;
              }   
         
           try {
             setloadingOrders(true);
             const response: any = await orderApi.getHomeopathyMedicineOrder(query);
             setorders(response?.data)
             setpagination(response?.pagination)
           } catch(error: any) {
             message.error(error?.message);
           } finally {
            setloadingOrders(false);
           }
       },
       [slectedDate],
   )

   const onDateChange = (date: any, dateString: string) => {
    setSelectedDate(dateString)
   }

   const medicineName = (medicines: any) => {
     let list: any = "";
     medicines.forEach((medicine: any) => list = list + medicine.name + " " + medicine.power + ", ")
     return list ? list : '---';
   }

   const orderRefresh = () => {
    homeopathyorders();
   }

   const onFinish = (values: any) => {
      if(values?.id) {
        router.push(`/order/${values?.id}`)
      }
    }

   useEffect(() => {
      homeopathyorders();
   },[homeopathyorders, slectedDate])

   return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Card className={styles.customTable} title={t("table:orderList")}>        
         <Row justify="space-between">
          <Col>
            <Form className={styles.searchForm} form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
              <Form.Item
                name="id"
                rules={[{ required: true, message: t("table:orderIdVerification")  }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t("table:orderId")} />
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
          </Col>
          <Col>
            <DatePicker placeholder={t("table:orderDate")} onChange={onDateChange} />
            <Button onClick={orderRefresh} loading={loadingOrders} style={{marginLeft: 10}} type="primary">{t("table:refresh")}</Button>
          </Col>
        </Row>
        <br />
          <Spin spinning={loadingOrders}>
            <Table>
              <Thead>
                <Tr>
                  {tableHeads.map(head => <Th>{head.title}</Th>)}
                </Tr>
              </Thead>
              <Tbody>
                {
                  orders.map((order: any) => <Tr>
                      <Td>{<Link href={`/order/${order.order_numeric_id}`}><a>{order.order_numeric_id}</a></Link>}</Td>
                      <Td><Tooltip title={medicineName(order?.medicine_list)}>{medicineName(order?.medicine_list)}</Tooltip></Td>
                      <Td>{order.medicine_bill === 0 ? <b style={{color: 'orange'}}>{t("table:preparing") }</b> : <>{t("appointment:taka")} {order.medicine_bill}</>}</Td>
                      <Td>{order.is_payment ? <b style={{color: 'green'}}>{t("table:paid") }</b> : <b style={{color: 'red'}}>{t("table:unpaid") }</b> }</Td>
                      <Td>
                        {order.delivery_status === DELIVERY.PENDING && <b style={{color: 'blue'}}>{t("table:pending") }</b>}
                        {order.delivery_status === DELIVERY.CHECKING && <b style={{color: 'black'}}>{t("table:checking") }</b>}
                        {order.delivery_status === DELIVERY.PROCESSING && <b style={{color: 'orange'}}>{t("table:processing") }</b>}
                        {order.delivery_status === DELIVERY.SHIPPED && <b style={{color: 'green'}}>{t("table:shipped") }</b>}
                        {order.delivery_status === DELIVERY.DELIVERED && <b style={{color: 'green'}}>{t("table:delivered") }</b>}
                        {order.delivery_status === DELIVERY.CANCELED && <b style={{color: 'red'}}>{t("table:canceled") }</b>}
                      </Td>
                      <Td>
                         <Link key={order?.customer_numeric_id} href={`/patient/${order?.customer_numeric_id}`}><a>{order?.customer_name}</a></Link> 
                      </Td>
                      <Td>{order.customer_numeric_id}</Td>
                      <Td>{order.customer_phone}</Td>
                      <Td>{moment(order.createdAt).format(DateFormats.DATE_TIME)}</Td>
                      <Td>{moment(order.updatedAt).format(DateFormats.DATE_TIME)}</Td>
                      <Td>
                        <Button type="primary" className={styles.marginRight10}><Link href={`/order/${order.order_numeric_id}`}>{t("table:details")}</Link></Button>
                      </Td>
                  </Tr>)
                }
              </Tbody>
            </Table>
          </Spin>
        
       <br />
       <Row justify="end">
          <Pagination responsive={true} showQuickJumper defaultCurrent={1} current={pagination?.current} pageSize={Number(pagination?.pageSize)}  onChange={homeopathyorders} total={Number(pagination?.total)} />
       </Row>
      </Card>
      </ErrorBoundary>
   )
} 
