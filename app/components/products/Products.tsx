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
  Popconfirm,
  Radio,
} from "antd";
import * as ProductsApi from "./ProductsApi";
import useTranslation from "next-translate/useTranslation";
import ImageUploader from "../imageUploader";
import * as CategoryApi from "../category/CategoryApi";
import * as TagApi from "../tag/TagApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import moment from "moment";
import { capitalize } from "lodash";
import styles from "./Styles.module.scss";
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

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
  const [pagination, setpagination] = useState({});
  const [imageData, setImageData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState<any>([]);

  const profile: any = useSelector(
    (state: RootState) => state.authModel.profile
  );

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.is_active ? record?.id : <del>{record?.id}</del>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.is_active ? record?.name : <del>{record?.name}</del>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        <>{record?.price}৳</>
    },
    {
      title: "Short Description",
      dataIndex: "shortDescription",
      key: "shortDescription",
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
          <Button
            onClick={() => handleEdit(record?._id)}
            type={record?.is_active ? "primary" : "ghost"}
          >
            {" "}
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    if (imageData && imageData.length > 0) {
      values.image = imageData.map((image: any) => image.url);
      values.images = imageData;
    } else {
      values.image = [];
      values.images = [];
    }
    try {
      setloading(true);
      values.last_updated_by = profile?.name;

      create
        ? await ProductsApi.createItem(values)
        : await ProductsApi.updateItem(item?._id, values);

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
    setImageData([]);
    try {
      setloading(true);
      const item: any = await ProductsApi.getItem(id);
      form.setFieldsValue({
        sku: item.sku,
        name: item.name,
        name_local: item.name_local,
        price: item.price,
        price_local: item.price_local,
        discount: item.discount,
        discount_local: item.discount_local,
        offerEnd: item.offerEnd,
        offerEnd_local: item.offerEnd_local,
        new: item.new,
        category: item.category,
        tag: item.tag,
        shortDescription: item.shortDescription,
        shortDescription_local: item.shortDescription_local,
        fullDescription: item.fullDescription,
        fullDescription_local: item.fullDescription_local,
        is_active: item.is_active,
        comment: item.comment,
        stock: item.stock,
      });

      setItem(item);
      setImageData(item.images);
    } catch (error: any) {
      setVisible(false);
      message.error(error?.message);
      message.error("Product Not Found");
    } finally {
      setloading(false);
    }
  };

  const onSearch = (values: any) => {
    if(values?.id) {
        handleEdit(values?.id)
      }
    }

  const handleCreate = (value: boolean) => {
    setCreate(value);
    setVisible(true);
    setImageData([]);
    form.setFieldsValue({
      sku: null,
      name: null,
      name_local: null,
      price: null,
      price_local: null,
      discount: null,
      discount_local: null,
      offerEnd: null,
      offerEnd_local: null,
      new: true,
      category: [],
      tag: [],
      shortDescription: null,
      shortDescription_local: null,
      fullDescription: null,
      fullDescription_local: null,
      is_active: true,
      comment: null,
      stock: null,
    });
  };

  const confirm = async () => {
    try {
      setloading(true);
      await ProductsApi.deleteItem(item?._id);
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
      const response: any = await ProductsApi.getItems({ ...params });
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
  };

  const getCategories = useCallback(async () => {
    try {
      const response: any = await CategoryApi.getAllItems();
      setCategories(response?.data);
    } catch (error: any) {
      message.error(error?.message);
    } finally {
    }
  }, []);

  const getTags = useCallback(async () => {
    try {
      const response: any = await TagApi.getAllItems();
      setTags(response?.data);
    } catch (error: any) {
      message.error(error?.message);
    } finally {
    }
  }, []);

  useEffect(() => {
    getItems();
    getCategories();
    getTags();
  }, [getItems, getCategories, getTags]);

  return (
    <Card
      title="Products List"
      extra={
        <Button type="primary" onClick={() => handleCreate(true)}>
          Create New
        </Button>
      }
    >
      <Drawer
        title={create ? "Create Product" : "Update Product"}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={550}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Sku"
            name="sku"
            rules={[{ required: true, message: "Please give sku" }]}
          >
            <Input placeholder="Sku" />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please give name" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Name Local"
            name="name_local"
            rules={[{ required: true, message: "Please give name local" }]}
          >
            <Input placeholder="Name Local" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please give price" }]}
          >
            <Input type="number" placeholder="price" />
          </Form.Item>
          <Form.Item
            label="Price Local"
            name="price_local"
            rules={[{ required: true, message: "Please price local" }]}
          >
            <Input placeholder="price local" />
          </Form.Item>
          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: "Please give Discount" }]}
          >
            <Input type="number" placeholder="Discount" />
          </Form.Item>
          <Form.Item
            label="Discount Local"
            name="discount_local"
            rules={[{ required: true, message: "Please give Discount local" }]}
          >
            <Input placeholder="Discount local" />
          </Form.Item>
          <Form.Item
            label="Offer End"
            name="offerEnd"
            rules={[{ required: true, message: "Please give offerEnd" }]}
          >
            <Input placeholder="Offer End" />
          </Form.Item>
          <Form.Item
            label="offerEnd Local"
            name="offerEnd_local"
            rules={[{ required: true, message: "Please give offerEnd local" }]}
          >
            <Input placeholder="Offer End local" />
          </Form.Item>
          
          <Form.Item name="new">
            <Radio.Group>
              <Radio.Button value={true}>New</Radio.Button>
              <Radio.Button value={false}>Not New</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Image" rules={[{ message: "Please give Image" }]}>
            <ImageUploader
              data={imageData}
              maxImageNumber={6}
              uploadPreset="products"
              handleImages={getImages}
            />
          </Form.Item>
          <Form.Item
            label="Short Description"
            name="shortDescription"
            rules={[
              { required: true, message: "Please give short Description" },
            ]}
          >
            <Input.TextArea placeholder="shortDescription" />
          </Form.Item>
          <Form.Item
            label="Short Description Local"
            name="shortDescription_local"
            rules={[
              {
                required: true,
                message: "Please give short Description local",
              },
            ]}
          >
            <Input.TextArea placeholder="Short Description local" />
          </Form.Item>
          <Form.Item
            label="Full Description"
            name="fullDescription"
            rules={[{ required: true, message: "Please give fullDescription" }]}
          >
            <Input.TextArea placeholder="full Description" />
          </Form.Item>
          <Form.Item
            label="Full Description Local"
            name="fullDescription_local"
            rules={[
              { required: true, message: "Please give fullDescription local" },
            ]}
          >
            <Input.TextArea placeholder="Full Description local" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please give Category" }]}
          >
            <Select
              mode="multiple"
              placeholder="Please select Category"
              style={{ width: "100%" }}
            >
              {categories &&
                categories.length > 0 &&
                categories.map((category: any) => (
                  <Option key={category.name} value={category.name}>
                    {category.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tag"
            name="tag"
            rules={[{ required: true, message: "Please give Tag" }]}
          >
            <Select
              mode="multiple"
              placeholder="Please select Tag"
              style={{ width: "100%" }}
            >
              {tags &&
                tags.length > 0 &&
                tags.map((tag: any) => (
                  <Option key={tag.name} value={tag.name}>
                    {tag.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please give Stock" }]}
          >
            <Input type="number" placeholder="Stock" />
          </Form.Item>
          <Form.Item name="is_active">
            <Radio.Group>
              <Radio.Button value={true}>Active</Radio.Button>
              <Radio.Button value={false}>Not Active</Radio.Button>
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
      </Drawer>
      <Form className={styles.searchForm} form={formSearch} name="horizontal_login" layout="inline" onFinish={onSearch}>
          <Form.Item
            name="id"
            rules={[{ required: true, message: "Give Product Numeric ID"  }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={"Id"} />
          </Form.Item>
          <Form.Item >
            <Button
              type="primary"
              htmlType="submit"
            >
                {t("table:find")}
            </Button>
          </Form.Item>
        </Form>
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
