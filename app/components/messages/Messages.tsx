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
  Popconfirm,
  Radio,
} from "antd";
import * as MessagesApi from "./MessagesApi";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import moment from "moment";
import { capitalize } from "lodash";


export default function Link() {
  const [visible, setVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation("ns1");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState<any>(undefined);
  const [params, setParams] = useState<any>(undefined);
  const [pagination, setpagination] = useState({});
  const profile: any = useSelector(
    (state: RootState) => state.authModel.profile
  );
  const columns: any = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        !record?.is_done ? record?.name : <del>{record?.name}</del>,
    },
    {
      title: "Customer Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_name: string, record: any) => moment(record?.createdAt).format('MMMM Do YYYY, h:mm:ss a')
    },
    {
      title: "Done",
      dataIndex: "is_done",
      key: "is_done",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.is_done ? "Yes" : "No",
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record?._id)} type={!record?.is_done ? "primary" : "ghost"}>
            {" "}
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    try {
      setloading(true);
      values.last_updated_by = profile?.name;

      create
        ? await MessagesApi.createItem(values)
        : await MessagesApi.updateItem(item?._id, values);

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
    } finally {
      setloading(false);
    }
  };

  const handleEdit = async (id: any) => {
    setCreate(false);
    setVisible(true);
    try {
      setloading(true);
      const item: any = await MessagesApi.getItem(id);
      form.setFieldsValue({
        name: item.name,
        phone: item.phone,
        subject: item.subject,
        message: item.message,
        created_at: moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
        is_done: item.is_done,
        comment: item.comment,
      });
      setItem(item);
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setloading(false);
    }
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const getItems = useCallback(async (params?: any) => {
    setParams(params);
    if (params && params?.total) {
      delete params.total;
    }

    try {
      setloading(true);
      const response: any = await MessagesApi.getItems({ ...params });
      setItems(response?.data);
      setpagination(response?.pagination);
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setloading(false);
    }
  }, []);

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card
      title="Messages List"
    >
      <Drawer
        title={create ? "Create Tag" : "Update Tag"}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Customer Name"
            name="name"
          >
            <Input readOnly  />
          </Form.Item>
          <Form.Item
            label="Customer Phone"
            name="phone"
          >
            <Input readOnly/>
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
          >
            <Input readOnly/>
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
          >
            <Input.TextArea readOnly/>
          </Form.Item>
          <Form.Item
            label="Created At"
            name="created_at"
          >
            <Input readOnly/>
          </Form.Item>
          <Form.Item name="is_done">
            <Radio.Group>
              <Radio.Button value={true}>Done</Radio.Button>
              <Radio.Button value={false}>Not Done</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {!create && (
            <Form.Item label="Last Updated By">
              <div>
                Name:{" "}
                {item && item?.last_updated_by ? item?.last_updated_by : "N/A"}
              </div>
              <div>Time: {item && capitalize(moment(item?.updatedAt).fromNow())}</div>
            </Form.Item>
          )}

          <Form.Item label="Comment" name="comment">
            <Input.TextArea placeholder="Leave a Comment" />
          </Form.Item>
          <Form.Item>
            <Space size="middle">
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={closeDrawer}>Close</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
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
