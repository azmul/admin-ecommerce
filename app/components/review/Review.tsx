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
  List,
  DatePicker,
  Rate,
  Popconfirm,
  Avatar,
  Skeleton,
} from "antd";
import * as ReviewApi from "./ReviewApi";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import { DateFormats } from "../../date/dateConst";
import { capitalize, remove } from "lodash";

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
  const [reviewItem, setReviewItem] = useState<any>(undefined);
  const [review, setReview] = useState<any>([]);

  const columns: any = [
    {
      title: "Product ID",
      dataIndex: "product_numeric_id",
      key: "product_numeric_id",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Product Created Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_name: string, record: any) =>
        moment(record?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Update Time",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_name: string, record: any) =>
        moment(record?.updatedAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (record: any) => (
        <Space size="middle">
          <Button
            onClick={() => handleEdit(record?.product_numeric_id)}
            type="primary"
          >
            {" "}
            Show Reviews
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
      const response: any = await ReviewApi.getReviewByProductId(id);
      setReviewItem(response);
      if (response && response?.reviews) {
        setReview(response.reviews);
      }
      setItem(item);
    } catch (error: any) {
      setVisible(false);
      message.error(error?.message);
      message.error("Review Not Found");
    } finally {
      setloading(false);
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
        const response: any = await ReviewApi.getItems({ ...query });
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

  const deleteReview = async (item: any) => {
    try {
      setloading(true);
      await ReviewApi.updateReviewItem(reviewItem._id, {
        reviewId: item.id,
        isDeleted: true,
      });
      remove(review, (i: any) => Number(i.id) === Number(item.id));
      setReview(review);
      message.success("Review deleted successfully");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card title="Review List">
      <Drawer
        title={`Review Details`}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={650}
        destroyOnClose={true}
      >
        <Spin spinning={loading}>
          {review && review.length > 0 ? (
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={review}
              renderItem={(item: any) => (
                <List.Item
                  actions={[
                    <Rate disabled key="rate" value={item.rating} />,
                    <Popconfirm
                      key={Math.random()}
                      title="Are you sure to delete this review?"
                      onConfirm={() => deleteReview(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <a href="#">Delete</a>
                    </Popconfirm>,
                  ]}
                >
                  <Skeleton avatar loading={loading} title={false} active>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`${item.customerName} (${
                        item.customerPhone
                      }) ${capitalize(moment(item.createdAt).fromNow())}`}
                      description={item.message}
                    />
                  </Skeleton>
                </List.Item>
              )}
            />
          ) : (
            "There is no reviews"
          )}
        </Spin>
      </Drawer>
      <Row justify="space-between">
        <Col></Col>
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
