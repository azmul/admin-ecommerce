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
  Alert,
} from "antd";
import * as TestimonialApi from "./TestimonialApi";
import useTranslation from "next-translate/useTranslation";
import ImageUploader from "../imageUploader";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import moment from "moment";
import { capitalize } from "lodash";
import comment from "antd/lib/comment";

export default function Link() {
  const [visible, setVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation("ns1");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState<any>(undefined);
  const [params, setParams] = useState<any>(undefined);
  const [pagination, setpagination] = useState(undefined);
  const [imageData, setImageData] = useState<any>([]);

  const profile: any = useSelector(
    (state: RootState) => state.authModel.profile
  );

  const columns: any = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // eslint-disable-next-line react/display-name
      render: (title: string, record: any) =>
        record?.is_active ? record?.title : <del>{record?.title}</del>,
    },
    {
      title: "Title Local",
      dataIndex: "title_local",
      key: "title_local",
    },
    {
      title: "Content Title",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Content Local Title",
      dataIndex: "content_local",
      key: "content_local",
    },
    {
      title: "Customer name",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_name: string, record: any) =>
        moment(record?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.is_active ? "Yes" : "No",
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (record: any) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record?._id)} type={record?.is_active ? "primary" : "ghost"}>
            {" "}
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    if(imageData && imageData.length > 0) {
      values.image = imageData[0].url;
      values.public_id = imageData[0].public_id;
    } else {
      values.image = null;
      values.public_id = null;
    }
    try {
      values.last_updated_by = profile?.name;
      setloading(true);

      create
        ? await TestimonialApi.createItem(values)
        : await TestimonialApi.updateItem(item?._id, values);

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
    setImageData([]);
    try {
      setloading(true);
      const item: any = await TestimonialApi.getItem(id);
      form.setFieldsValue({
        title: item.title,
        title_local: item.title_local,
        content: item.content,
        content_local: item.content_local,
        customer_name: item.customer_name,
        is_active: item.is_active,
        comment: item.comment,
      });

      if(item.image) {
        setImageData([{
          url: item.image,
          uid: Math.floor(Math.random() * -100).toString(),
          name: item.public_id,
          status: 'done',
          public_id: item.public_id,
        }]);
      }
  
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
    setImageData([]);
    form.setFieldsValue({
      title: null,
      title_local: null,
      content: null,
      content_local: null,
      customer_name: null,
      is_active: true,
      comment: null,
    });
  };

  const confirm = async () => {
    try {
      setloading(true);
      await TestimonialApi.deleteItem(item?._id);
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
      const response: any = await TestimonialApi.getItems({ ...params });
      setItems(response?.data);
      setpagination(response?.pagination);
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setloading(false);
    }
  }, []);

  const getImages = (data: any) => {
    setImageData(data);
  }

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card
      title="Testimonial List"
      extra={
        <Button type="primary" onClick={() => handleCreate(true)}>
          Create New
        </Button>
      }
    >
       
      <Drawer
        title={create ? "Create Testimonial" : "Update Testimonial"}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        destroyOnClose={true}
        width={550}
      >
        <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Customer Name"
            name="customer_name"
            rules={[{ required: true, message: "Please give customer name" }]}
          >
            <Input placeholder="Customer Name" />
          </Form.Item>
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
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please give Content" }]}
          >
            <Input placeholder="Content" />
          </Form.Item>
          <Form.Item
            label="Content Local"
            name="content_local"
            rules={[{ required: true, message: "Please give Content local" }]}
          >
            <Input placeholder="Content local name" />
          </Form.Item>

          <Form.Item name="is_active">
            <Radio.Group>
              <Radio.Button value={true}>Active</Radio.Button>
              <Radio.Button value={false}>InActive</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Alert message="If you add/delete image please Click Update/Create Button in the below otherwise image would not be saved" type="success" />
          <Form.Item
            label="Image"
            rules={[{ message: "Please give image" }]}
          >
            <ImageUploader data={imageData} maxImageNumber={1} uploadPreset="sliders" handleImages={getImages} />
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
                {create ? "Create" : "Update"}
              </Button>
              <Button onClick={closeDrawer}>Close</Button>
              {!create && (
                <Popconfirm
                  title="Are you sure want to delete"
                  onConfirm={confirm}
                >
                  <Button danger> Delete </Button>{" "}
                </Popconfirm>
              )}
            </Space>
          </Form.Item>
        </Form>
        </Spin>
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
