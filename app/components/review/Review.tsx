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
  Modal,
} from "antd";
import * as ReviewApi from "./ReviewApi";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import { DateFormats } from "app/date/dateConst";
import { capitalize, remove } from "lodash";

const { RangePicker } = DatePicker;

export default function Link() {
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation("ns1");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState<any>(undefined);
  const [params, setParams] = useState<any>(undefined);
  const [pagination, setpagination] = useState(undefined);
  const [selectedReview, setselectedReview] = useState<any>(undefined);
  const [slectedDate, setSelectedDate] = useState<any>(undefined);
  const [reviewItem, setReviewItem] = useState<any>(undefined);
  const [review, setReview] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        id: item.id,
        isDeleted: true,
      });
      remove(review, (i: any) => Number(i.id) === Number(item.id));
      setReview(review);
      message.success("Review deleted successfully");
    } finally {
      setloading(false);
    }
  };

  const handleOk = async () => {
    const answer = form.getFieldValue("ans");
    if (!answer) {
      form.setFields([
        {
          name: "ans",
          errors: ["Please give answer"],
        },
      ]);
      return;
    }
    try {
      await ReviewApi.updateReviewItem(reviewItem._id, {
        id: selectedReview.id,
        ans: answer,
      });

      const newReviews = [...review];
      const reviewIndex = newReviews.findIndex(
        (review: any) => Number(review.id) === Number(selectedReview.id)
      );
      newReviews[reviewIndex].ans = answer;
      setReview(newReviews);

      form.setFields([
        {
          name: "ans",
          value: null,
          errors: [],
        },
      ]);
      setIsModalVisible(false);
      message.success("Answer added successfully");
    } catch (error: any) {
      message.error(error?.message);
      message.error("Review Not Found");
    } finally {
    }
  };

  const handleCancel = () => {
    form.setFields([
      {
        name: "ans",
        value: null,
        errors: [],
      },
    ]);
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleAnswer = (review: any) => {
    showModal();
    if (review && review?.ans) {
      form.setFields([
        {
          name: "ans",
          value: review?.ans,
          errors: [],
        },
      ]);
    }
    setselectedReview(review);
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card title="Review List">
      <Modal
        title={selectedReview && selectedReview.message}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item
            name="ans"
            rules={[{ required: true, message: "Please give answer" }]}
          >
            <Input.TextArea rows={4} placeholder="Write your answer here..." />
          </Form.Item>
        </Form>
      </Modal>
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
                      description={
                        <>
                          <p>Review Comment: {item.message}</p>
                          <p>
                            Answer:{" "}
                            {item.ans ? (
                              <>
                                {item.ans}
                                <div>
                                  <Button
                                    type="primary"
                                    ghost
                                    onClick={() => handleAnswer(item)}
                                  >
                                    {" "}
                                    Edit Answer
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <Button
                                danger
                                ghost
                                onClick={() => handleAnswer(item)}
                              >
                                {" "}
                                Give Answer
                              </Button>
                            )}
                          </p>
                        </>
                      }
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
