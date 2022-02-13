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
  Row,
  Col,
  Descriptions,
  Divider,
  DatePicker,
} from "antd";
import * as ProductsApi from "./CustomersApi";
import useTranslation from "next-translate/useTranslation";
import { DELIVERY } from "app/api/commonConst";
import moment from "moment";
import styles from "./Styles.module.scss";
import { UserOutlined } from "@ant-design/icons";
import { DateFormats } from "app/date/dateConst";

const { RangePicker } = DatePicker;

export default function Link() {
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [formSearch] = Form.useForm();
  const { t } = useTranslation("ns1");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState<any>(undefined);
  const [params, setParams] = useState<any>(undefined);
  const [pagination, setpagination] = useState(undefined);
  const [slectedDate, setSelectedDate] = useState<any>(undefined);

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Upazila",
      dataIndex: "upazila",
      key: "upazila",
    },
    {
      title: "Registered Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_name: string, record: any) =>
        moment(record?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record?._id)} type="primary">
            {" "}
            Show Details
          </Button>
        </Space>
      ),
    },
  ];

  const onDateChange = (dates: any) => {
    setSelectedDate(dates);
  };

  const handleEdit = async (id: any) => {
    setVisible(true);
    try {
      setloading(true);
      const item: any = await ProductsApi.getItem(id);

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
    <Card title="Customer List">
      <Drawer
        title={`Customer Details #${item?.id}`}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={650}
        destroyOnClose={true}
      >
        <Spin spinning={loading}>
          <Descriptions column={1} title="Customer Info">
            <Descriptions.Item label="ID">{item && item.id}</Descriptions.Item>
            <Descriptions.Item label="Name">
              {item && item.name}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {item && item.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Gender">
              {item && item.gender}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {item && item.email}
            </Descriptions.Item>
            <Descriptions.Item label="District">
              {item && item.district}
            </Descriptions.Item>
            <Descriptions.Item label="Upazila">
              {item && item.upazila}
            </Descriptions.Item>
            <Descriptions.Item label="Post Code">
              {item && item.post_code}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {item && item.address}
            </Descriptions.Item>
            <Descriptions.Item label="Registered Time">
              {moment(item?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </Descriptions.Item>
            <Descriptions.Item label="Last Profile Update Time">
              {moment(item?.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          {item?.orders.length > 0 ? (
            <>
              {item?.orders.reverse().map((order: any) => (
                <div key={order.id} className={styles.orders}>
                  <Card
                    title={`Order ID: #${order.id}`}
                    extra={
                      <div>
                        Placed on: <br />
                        {moment(order.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </div>
                    }
                  >
                    <div className={styles.delivery}>
                      <Row justify="end">
                        <Col sm={12} xs={12}>
                          Expected delivery: <br />
                          As per delivery policy
                        </Col>
                        <Col sm={8} xs={12}>
                          Total: {order.cartTotalPrice}/=
                        </Col>
                        <Col sm={4} xs={12}>
                          {order.shippingStatus === DELIVERY.PENDING && (
                            <b style={{ color: "blue" }}>Pending</b>
                          )}
                          {order.shippingStatus === DELIVERY.CHECKING && (
                            <b style={{ color: "black" }}>Checking</b>
                          )}
                          {order.shippingStatus === DELIVERY.PROCESSING && (
                            <b style={{ color: "orange" }}>Processing</b>
                          )}
                          {order.shippingStatus === DELIVERY.SHIPPED && (
                            <b style={{ color: "green" }}>Shipped</b>
                          )}
                          {order.shippingStatus === DELIVERY.DELIVERED && (
                            <b style={{ color: "green" }}>Delivered</b>
                          )}
                          {order.shippingStatus === DELIVERY.CANCELED && (
                            <b style={{ color: "red" }}>Canceled</b>
                          )}
                        </Col>
                      </Row>
                    </div>
                    {order.products &&
                      order.products.map((product: any) => (
                        <div key={product.id} className={styles.product}>
                          <Row justify="center">
                            <Col sm={2} xs={12}>
                              <img
                                alt="PRODUCT_IMAGE"
                                width="50"
                                height="50"
                                src={product.image[0]}
                              />
                            </Col>
                            <Divider type="vertical" />
                            <Col sm={8} xs={12}>
                              Product 1: <br />
                              {product.name}
                            </Col>
                            <Divider type="vertical" />
                            <Col sm={5} xs={12}>
                              Discount: {product.discount}৳
                            </Col>
                            <Divider type="vertical" />
                            <Col sm={5} xs={12}>
                              Price: {product.price}৳
                            </Col>
                            <Divider type="vertical" />
                            <Col sm={3} xs={12}>
                              Qnt: <br />
                              {product.quantity}
                            </Col>
                          </Row>
                        </div>
                      ))}
                  </Card>
                </div>
              ))}{" "}
            </>
          ) : (
            <div>No Order</div>
          )}
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
          pagination={pagination}
          loading={loading}
          columns={columns}
          dataSource={items}
        />
      </Spin>
    </Card>
  );
}
