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
} from "antd";
import * as SliderApi from "./SliderApi";
import useTranslation from "next-translate/useTranslation";

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

  const columns: any = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Title Local",
      dataIndex: "title_local",
      key: "title_local",
    },
    {
      title: "Sub Title",
      dataIndex: "subtitle",
      key: "subtitle",
    },
    {
      title: "Sub Title",
      dataIndex: "subtitle_local",
      key: "subtitle_local",
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

  const onFinish = async (values: any) => {
    try {
      setloading(true);

      create
        ? await SliderApi.createItem(values)
        : await SliderApi.updateItem(item?._id, values);

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
      const item: any = await SliderApi.getItem(id);
      form.setFieldsValue({
        title: item.title,
        title_local: item.title_local,
        subtitle: item.subtitle,
        subtitle_local: item.subtitle_local,
        image: item.image,
        url: item.url
      });
      setItem(item);
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setloading(false);
    }
  };

  const handleCreate = (value: boolean) => {
    setCreate(value);
    setVisible(true);
    form.setFieldsValue({
      title: null,
      title_local: null,
      subtitle: null,
      subtitle_local: null,
      image: null,
      url: null
    });
  };

  const confirm = async () => {
    try {
      setloading(true);
      await SliderApi.deleteItem(item?._id);
      setVisible(false);
      getItems(params);
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
      const response: any = await SliderApi.getItems({ ...params });
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
      title="Slider List"
      extra={
        <Button type="primary" onClick={() => handleCreate(true)}>
          Create New
        </Button>
      }
    >
      <Drawer
        title={create ? "Create Slider" : "Update Slider"}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please title name" }]}
          >
            <Input placeholder="title" />
          </Form.Item>
          <Form.Item
            label="Title Local"
            name="title_local"
            rules={[{ required: true, message: "Please title local name" }]}
          >
            <Input placeholder="title local" />
          </Form.Item>
          <Form.Item
            label="Subtitle"
            name="subtitle"
            rules={[{ required: true, message: "Please give subtitle name" }]}
          >
            <Input placeholder="subtitle name" />
          </Form.Item>
          <Form.Item
            label="Subtitle"
            name="subtitle_local"
            rules={[{ required: true, message: "Please give subtitle local name" }]}
          >
            <Input placeholder="subtitle local name" />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please give image" }]}
          >
            <Input placeholder="image" />
          </Form.Item>
          <Form.Item
            label="Url"
            name="url"
            rules={[{ required: true, message: "Please give url" }]}
          >
            <Input placeholder="url" />
          </Form.Item>
          <Form.Item>
            <Space size="middle">
              <Button type="primary" htmlType="submit">
                {create ? "Create" : "Update"}
              </Button>
              <Button onClick={closeDrawer}>Close</Button>
              {!create && (
                <Popconfirm
                  title="Are you sure want to delete"
                  onConfirm={confirm}
                  onVisibleChange={() => console.log("visible change")}
                >
                  <Button danger> Delete </Button>{" "}
                </Popconfirm>
              )}
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
