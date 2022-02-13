import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  message,
  Spin,
  Form,
  Input,
  Button,
  Drawer,
  Table,
  Space,
  Select,
  Descriptions,
  Divider,
  DatePicker,
  Row,
  Col,
} from "antd";
import * as ProductsApi from "./OrdersApi";
import useTranslation from "next-translate/useTranslation";
import { PAYMENT, DELIVERY } from "app/api/commonConst";
import { useSelector } from "react-redux";
import { RootState } from "app/../redux/store";
import moment from "moment";
import { capitalize } from "lodash";
import styles from "./Styles.module.scss";
import { UserOutlined } from "@ant-design/icons";
import { DateFormats } from "app/date/dateConst";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Link() {
  const [visible, setVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const { t } = useTranslation("ns1");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState<any>(undefined);
  const [params, setParams] = useState<any>(undefined);
  const [pagination, setpagination] = useState(undefined);
  const [slectedDate, setSelectedDate] = useState<any>(undefined);

  const profile: any = useSelector(
    (state: RootState) => state.authModel.profile
  );

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Total Price",
      dataIndex: "cartTotalPrice",
      key: "cartTotalPrice",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) => <>{record?.cartTotalPrice}৳</>,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.paymentMethod === PAYMENT.CASE_ON_DELIVERY
          ? "Cash On Delivery"
          : record?.paymentMethod === PAYMENT.BKASH
          ? "Bkash"
          : record?.paymentMethod === PAYMENT.NAGAD
          ? "Nagad"
          : record?.paymentMethod === PAYMENT.ROCKET
          ? "Rocket"
          : "",
    },
    {
      title: "Delivery Status",
      dataIndex: "shippingStatus",
      key: "shippingStatus",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) => (
        <>
          {record.shippingStatus === DELIVERY.PENDING && (
            <b style={{ color: "blue" }}>Pending</b>
          )}
          {record.shippingStatus === DELIVERY.CHECKING && (
            <b style={{ color: "black" }}>Checking</b>
          )}
          {record.shippingStatus === DELIVERY.PROCESSING && (
            <b style={{ color: "orange" }}>Processing</b>
          )}
          {record.shippingStatus === DELIVERY.SHIPPED && (
            <b style={{ color: "green" }}>Shipped</b>
          )}
          {record.shippingStatus === DELIVERY.DELIVERED && (
            <b style={{ color: "green" }}>Delivered</b>
          )}
          {record.shippingStatus === DELIVERY.CANCELED && (
            <b style={{ color: "red" }}>Canceled</b>
          )}
        </>
      ),
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_name: string, record: any) =>
        moment(record?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Registered User",
      dataIndex: "userRegistered",
      key: "userRegistered",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.userRegistered ? "Yes" : "No",
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record?._id)} type="primary">
            {" "}
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onDateChange = (dates: any) => {
    setSelectedDate(dates);
  };

  const onFinish = async (values: any) => {
    try {
      setloading(true);
      values.last_updated_by = profile?.name;
      values.customer_phone = item?.userAddress?.phone;
      values.order_id = item?.id;

      await ProductsApi.updateItem(item?._id, values);

      message.success({
        content: `${create ? "Created" : "Updated"} Sucessfully`,
        style: {
          marginTop: "10vh",
        },
        duration: 5,
      });

      form.resetFields();
      setVisible(false);
      getItems(params);
    } catch (error: any) {
      message.error(error?.message);
      message.error("Product Not Found");
    } finally {
      setloading(false);
    }
  };

  const handleEdit = async (id: any) => {
    setCreate(false);
    setVisible(true);
    try {
      setloading(true);
      const item: any = await ProductsApi.getItem(id);
      form.setFieldsValue({
        shippingStatus: item.shippingStatus,
        comment: item.comment,
      });

      setItem(item);
    } catch (error: any) {
      setVisible(false);
      message.error(error?.message);
      message.error("Product Not Found");
    } finally {
      setloading(false);
    }
  };

  const onSearch = (values: any) => {
    if (values?.id) {
      handleEdit(values?.id);
    }
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const getItems = useCallback(
    async (params?: any) => {
      setParams(params);
      const query: any = { ...params };

      if (slectedDate) {
        query.startDate = moment(slectedDate[0]).format(DateFormats.API_DATE);
        query.endDate = moment(slectedDate[1])
          .add(1, "days")
          .format(DateFormats.API_DATE);
      }

      if (query && query?.total) {
        delete query.total;
      }

      try {
        setloading(true);
        const response: any = await ProductsApi.getItems({ ...query });
        setItems(response?.data);
        setpagination(response?.pagination);
      } catch (error: any) {
        message.error(error?.message);
      } finally {
        setloading(false);
      }
    },
    [slectedDate]
  );

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card title="Orders List">
      <Drawer
        title={`Update Order #${item?.id}`}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={550}
      >
        <Spin spinning={loading}>
          <Descriptions column={2} title="Price Info">
            <Descriptions.Item label="Total Price">
              {item && item.cartTotalPrice}৳
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {item && item?.paymentMethod === PAYMENT.CASE_ON_DELIVERY
                ? "Cash On Delivery"
                : item && item?.paymentMethod === PAYMENT.BKASH
                ? "Bkash"
                : item && item?.paymentMethod === PAYMENT.NAGAD
                ? "Nagad"
                : item && item?.paymentMethod === PAYMENT.ROCKET
                ? "Rocket"
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Status">
              {item && item.shippingStatus === DELIVERY.PENDING && (
                <b style={{ color: "blue" }}>Pending</b>
              )}
              {item && item.shippingStatus === DELIVERY.CHECKING && (
                <b style={{ color: "black" }}>Checking</b>
              )}
              {item && item.shippingStatus === DELIVERY.PROCESSING && (
                <b style={{ color: "orange" }}>Processing</b>
              )}
              {item && item.shippingStatus === DELIVERY.SHIPPED && (
                <b style={{ color: "green" }}>Shipped</b>
              )}
              {item && item.shippingStatus === DELIVERY.DELIVERED && (
                <b style={{ color: "green" }}>Delivered</b>
              )}
              {item && item.shippingStatus === DELIVERY.CANCELED && (
                <b style={{ color: "red" }}>Canceled</b>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions column={1} title="Customer Info">
            <Descriptions.Item label="Name">
              {item && item.userAddress.name}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {item && item.userAddress.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Registered User">
              {item && item.userRegistered ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="District">
              {item && item.userAddress.district}
            </Descriptions.Item>
            <Descriptions.Item label="Upazila">
              {item && item.userAddress.upazila}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {item && item.userAddress.address}
            </Descriptions.Item>
            <Descriptions.Item label="Additional Comment">
              {item && item.userAddress.message}
            </Descriptions.Item>
          </Descriptions>

          {item &&
            item?.products.map((product: any) => (
              <>
                {
                  <Descriptions column={2} title="Product Info">
                    <Descriptions.Item label="SKU">
                      {product.sku}
                    </Descriptions.Item>
                    <Descriptions.Item label="ID">
                      {product.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">
                      {product.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                      {product.price}৳
                    </Descriptions.Item>
                    <Descriptions.Item label="Quantity">
                      {product.quantity}
                    </Descriptions.Item>
                    <Descriptions.Item label="Discount">
                      {product.discount}%
                    </Descriptions.Item>
                    <Descriptions.Item label="Discounted Price">
                      {product.finalDiscountedPrice}৳
                    </Descriptions.Item>
                    <Descriptions.Item label="Offer End">
                      {product.offerEnd}
                    </Descriptions.Item>
                    <Descriptions.Item label="Image">
                      <img
                        alt="Product Image"
                        src={product.image[0]}
                        width="100"
                        height="100"
                      />
                    </Descriptions.Item>
                  </Descriptions>
                }
              </>
            ))}

          <Divider />

          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Delivery Status"
              name="shippingStatus"
              rules={[{ required: true, message: "Please give Tag" }]}
            >
              <Select placeholder="Please select Tag" style={{ width: "100%" }}>
                <Option key={DELIVERY.PENDING} value={DELIVERY.PENDING}>
                  Pending
                </Option>
                <Option key={DELIVERY.CHECKING} value={DELIVERY.CHECKING}>
                  Checking
                </Option>
                <Option key={DELIVERY.PROCESSING} value={DELIVERY.PROCESSING}>
                  Processing
                </Option>
                <Option key={DELIVERY.SHIPPED} value={DELIVERY.SHIPPED}>
                  Shipped
                </Option>
                <Option key={DELIVERY.DELIVERED} value={DELIVERY.DELIVERED}>
                  Delivered
                </Option>
                <Option key={DELIVERY.CANCELED} value={DELIVERY.CANCELED}>
                  Closed
                </Option>
              </Select>
            </Form.Item>

            {!create && (
              <Form.Item label="Last Updated By">
                <div>
                  Name:{" "}
                  {item && item?.last_updated_by
                    ? item?.last_updated_by
                    : "N/A"}
                </div>
                <div>
                  Time: {item && capitalize(moment(item?.updatedAt).fromNow())}
                </div>
              </Form.Item>
            )}

            <Form.Item label="Comment" name="comment">
              <Input.TextArea placeholder="Leave a Comment" />
            </Form.Item>

            <Form.Item>
              <Space size="middle">
                <Button type="primary" htmlType="submit">
                  {create ? "Create" : "Update"}
                </Button>
                <Button onClick={closeDrawer}>Close</Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Drawer>
      <Row justify="space-between">
        <Col>
          <Form
            className={styles.searchForm}
            form={formSearch}
            name="horizontal_login"
            layout="inline"
            onFinish={onSearch}
          >
            <Form.Item
              name="id"
              rules={[{ required: true, message: "Give Product Numeric ID" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={"Id"}
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
          <RangePicker
            ranges={{
              Today: [moment(), moment()],
              "This Month": [
                moment().startOf("month"),
                moment().endOf("month"),
              ],
            }}
            onChange={onDateChange}
          />
          <Button
            onClick={getItems}
            loading={loading}
            style={{ marginLeft: 10 }}
            type="primary"
          >
            Refresh
          </Button>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <Table
          onChange={getItems}
          pagination={pagination && pagination}
          loading={loading}
          columns={columns}
          dataSource={items}
        />
      </Spin>
    </Card>
  );
}
