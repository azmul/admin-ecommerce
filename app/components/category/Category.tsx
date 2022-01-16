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
  Pagination,
} from "antd";
import * as CategoryApi from "./CategoryApi";
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.is_active ? record?.name : <del>{record?.name}</del>,
    },
    {
      title: "Local Name",
      dataIndex: "name_local",
      key: "name_local",
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
      title: "Created Time",
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
          <Button onClick={() => handleEdit(record?._id)} type={record?.is_active ? "primary" : "ghost"}>
            {" "}
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    try {
      values.last_updated_by = profile?.name;
      setloading(true);

      create
        ? await CategoryApi.createItem(values)
        : await CategoryApi.updateItem(item?._id, values);

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
      const item: any = await CategoryApi.getItem(id);
      form.setFieldsValue({
        name: item.name,
        name_local: item.name_local,
        comment: item.comment,
        is_active: item.is_active,
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
      name: null,
      name_local: null,
      is_active: true,
      comment: null,
    });
  };

  const confirm = async () => {
    try {
      setloading(true);
      await CategoryApi.deleteItem(item?._id);
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
      const response: any = await CategoryApi.getItems({ ...params });
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
      title="Category List"
      extra={
        <Button type="primary" onClick={() => handleCreate(true)}>
          Create New
        </Button>
      }
    >
      <Drawer
        title={create ? "Create Category" : "Update Category"}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
      >
              <Spin spinning={loading}>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please give name" }]}
          >
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item
            label="Local Name"
            name="name_local"
            rules={[{ required: true, message: "Please give local name" }]}
          >
            <Input placeholder="local name" />
          </Form.Item>

          <Form.Item name="is_active">
            <Radio.Group>
              <Radio.Button value={true}>Active</Radio.Button>
              <Radio.Button value={false}>InActive</Radio.Button>
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
