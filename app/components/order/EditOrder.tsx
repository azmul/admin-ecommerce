import {useState, useEffect} from "react"
import { Descriptions, PageHeader, Form ,Button, Space, 
  Input, Select, message, Spin, Divider, Row, Col} from "antd";
import useTranslation from 'next-translate/useTranslation'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import * as orderApi from "./OrderApi";
import { useRouter } from 'next/router';
import { DELIVERY } from "../common/deliveryConst";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import { DateFormats } from "../../date/dateConst";
import moment from "moment";

const { Option } = Select;

export default function MedicineOrder () {0
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('ns1');
  const [loading, setloading] = useState(false)
  const [order, setOrder] = useState<any>(undefined);

  const onFinish = async (values: any) => {
    if(values && values?.medicine_list) {
      delete values?.medicine_list
    }

    try {
        if(typeof(order?._id) === "string") {
            setloading(true);
            const response = await orderApi.updateOrder(order?._id, values)
            setOrder(response);

            message.success({
                content:  t("order:orderSaveSucessMessage"),
                style: {
                marginTop: '10vh',
                },
                duration: 3,
            });
        }
    } catch(error: any) {
      message.error(error?.message);
    } finally {
      setloading(false);
    }
  }

  const getOrder = async () => {
    try {
      if(typeof(id) === "string") {
        setloading(true);
        const response: any = await orderApi.getOrder(id);
        setOrder(response);
      }
    }  catch(error: any) {
      message.error(error?.message)
      router.push("/order")
    }finally {
      setloading(false);
    }
  }


  useEffect(() => {
    getOrder();
  }, [id]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>

      <Spin spinning={loading}>
       { order && !loading &&  
         <PageHeader
         ghost={false}
         onBack={() => window.history.back()}
         title={t("order:editOrder")}>
           <Descriptions title={t("order:orderBasicInfo")}>
            <Descriptions.Item label={t("table:orderId")}>{order?.order_numeric_id || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label={t("table:price")}>{t("appointment:taka")}{order?.medicine_bill || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label={t("table:payment")}>
               {order.is_payment ? <b style={{color: 'green'}}>{t("table:paid") }</b> : <b style={{color: 'red'}}>{t("table:unpaid") }</b> }
            </Descriptions.Item>
            <Descriptions.Item label={t("table:delivaryStatus")}>
              {order.delivery_status === DELIVERY.PENDING && <b style={{color: 'blue'}}>{t("table:pending") }</b>}
              {order.delivery_status === DELIVERY.CHECKING && <b style={{color: 'black'}}>{t("table:checking") }</b>}
              {order.delivery_status === DELIVERY.PROCESSING && <b style={{color: 'orange'}}>{t("table:processing") }</b>}
              {order.delivery_status === DELIVERY.SHIPPED && <b style={{color: 'green'}}>{t("table:shipped") }</b>}
              {order.delivery_status === DELIVERY.DELIVERED && <b style={{color: 'green'}}>{t("table:delivered") }</b>}
              {order.delivery_status === DELIVERY.CANCELED && <b style={{color: 'red'}}>{t("table:canceled") }</b>}
            </Descriptions.Item>
            <Descriptions.Item label={t("table:createdAt")}>
              {moment(order.createdAt).format(DateFormats.DATE_TIME)}
            </Descriptions.Item>
            <Descriptions.Item label={t("table:updatedAt")}>
              {moment(order.updatedAt).format(DateFormats.DATE_TIME)}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Descriptions title={t("appointment:patientBasicInfo")}>
            <Descriptions.Item label={t("appointment:name")}>{order?.customer_name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label={t("appointment:id")}>{order?.customer_numeric_id || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label={t("appointment:phone")}>{order?.customer_phone || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label={t("appointment:address")}>{order?.customer_address || 'N/A'}</Descriptions.Item>
          </Descriptions>
          <Divider />
          <Form
            name="order"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
               "medicine_list": order?.medicine_list,
               "medicine_bill": order?.medicine_bill,
               "delivery_status": order?.delivery_status
            }}
            >
            <Form.List name="medicine_list">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        label={t("order:medicineName")}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: t("order:medicineNameVerification") }]}
                      >
                        <Input readOnly={true} placeholder={t("order:medicineNameVerification")} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label={t("order:medicinePower")}
                        name={[name, 'power']}
                        fieldKey={[fieldKey, 'power']}
                        rules={[{ required: true, message: t("order:medicinePowerVerification") }]}
                      >
                        <Input readOnly placeholder={t("order:medicinePowerVerification")} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label={t("order:medicineQuantity")}
                        name={[name, 'quantity']}
                        fieldKey={[fieldKey, 'quantity']}
                        rules={[{ required: true, message: t("order:medicineQuantityVerification") }]}
                      >
                        <Input readOnly placeholder={t("order:medicineQuantityVerification")} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label={t("order:medicineCountry")}
                        name={[name, 'country']}
                        
                        fieldKey={[fieldKey, 'country']}
                        rules={[{ required: true, message: t("order:medicineCountryVerification") }]}
                      >
                          <Select placeholder={t("order:medicineCountryVerification")}>
                            <Option key={'germany'} value={'germany'}>
                              {t("order:germany")}
                            </Option>
                            <Option key={'bangladesh'} value={'bangladesh'}>
                              {t("order:bangladesh")}
                            </Option>
                            <Option key={'india'} value={'india'}>
                              {t("order:india")}
                            </Option>
                         </Select>
                        </Form.Item>
                    </Space>
                  ))}                  
                  </>
                )}
             </Form.List>
             <Row justify="space-between">
              <Col xs={24} md={10}>
                  <Form.Item name="medicine_bill" label={`${t("appointment:taka")} ${t("order:medicineBill")}`}>
                    <Input placeholder={t("order:medicineBillCalculation")} />
                  </Form.Item>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col xs={24} md={10}>
                <Form.Item name="delivery_status" label={t("order:deliveryStatus")}>
                    <Select placeholder={t("order:medicineCountryVerification")}>
                      <Option key={DELIVERY.PENDING} value={DELIVERY.PENDING}>
                         <b style={{color: 'blue'}}>{t("table:pending") }</b>
                      </Option>
                      <Option key={DELIVERY.CHECKING} value={DELIVERY.CHECKING}>
                        <b style={{color: 'black'}}>{t("table:checking") }</b>
                      </Option>
                      <Option key={DELIVERY.PROCESSING} value={DELIVERY.PROCESSING}>
                        <b style={{color: 'orange'}}>{t("table:processing") }</b>
                      </Option>
                      <Option key={DELIVERY.SHIPPED} value={DELIVERY.SHIPPED}>
                        <b style={{color: 'green'}}>{t("table:shipped") }</b>
                      </Option>
                      <Option key={DELIVERY.DELIVERED} value={DELIVERY.DELIVERED}>
                        <b style={{color: 'green'}}>{t("table:delivered") }</b>
                      </Option>
                      <Option key={DELIVERY.CANCELED} value={DELIVERY.CANCELED}>
                        <b style={{color: 'red'}}>{t("table:canceled") }</b>
                      </Option>
                    </Select>                  
                </Form.Item>
              </Col>
            </Row>
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  {t("order:save") }
                </Button>
              </Form.Item>
           </Form>
           <br />
           <br />
           
      </PageHeader>
    }
  </Spin>
  </ErrorBoundary>
  )
}