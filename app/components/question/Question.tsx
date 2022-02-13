import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  message,
  Form,
  Spin,
  Input,
  Button,
  Drawer,
  Table,
  Space,
  Row,
  Col,
  List,
  DatePicker,
  Modal,
  Avatar,
  Skeleton,
} from "antd";
import * as QuestionApi from "./QuestionApi";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import { DateFormats } from "app/date/dateConst";
import { capitalize, remove } from "lodash";

const { RangePicker } = DatePicker;

export default function Link() {
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [item, setItem] = useState<any>(undefined);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(undefined);
  const [params, setParams] = useState<any>(undefined);
  const [pagination, setpagination] = useState(undefined);
  const [slectedDate, setSelectedDate] = useState<any>(undefined);
  const [Question, setQuestion] = useState<any>([]);
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
            Show Questions
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
      const response: any = await QuestionApi.getQuestionByProductId(id);
      if (response && response?.questions) {
        setQuestion(response.questions);
      }
      setItem(response);
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
        const response: any = await QuestionApi.getItems({ ...query });
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

  const showModal = () => {
    setIsModalVisible(true);
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
      await QuestionApi.updateQuestionItem(item._id, {
        id: selectedQuestion.id,
        ans: answer,
      });

      const newQuestions = [...Question];
      const questionIndex = newQuestions.findIndex(
        (question: any) => Number(question.id) === Number(selectedQuestion.id)
      );
      newQuestions[questionIndex].ans = answer;
      setQuestion(newQuestions);

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
      message.error("Question Not Found");
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

  const handleAnswer = (question: any) => {
    showModal();
    if (question && question?.ans) {
      form.setFields([
        {
          name: "ans",
          value: question?.ans,
          errors: [],
        },
      ]);
    }
    setSelectedQuestion(question);
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card title="Question List">
      <Modal
        title={selectedQuestion && selectedQuestion.ques}
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
        title={`Question Details`}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={650}
        destroyOnClose={true}
      >
        <Spin spinning={loading}>
          {Question && Question.length > 0 ? (
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={Question}
              renderItem={(item: any) => (
                <List.Item>
                  <Skeleton avatar loading={loading} title={false} active>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={`${item.customerName} (${
                        item.customerPhone
                      }) ${capitalize(moment(item.createdAt).fromNow())}`}
                      description={
                        <>
                          <p>Question: {item.ques}</p>
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
            "There is no Questions"
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
