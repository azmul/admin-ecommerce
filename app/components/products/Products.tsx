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
  DatePicker,
  Row,
  Col,
  Checkbox,
  Divider,
  Alert,
} from "antd";
import * as ProductsApi from "./ProductsApi";
import useTranslation from "next-translate/useTranslation";
import ImageUploader from "../imageUploader";
import * as CategoryApi from "../category/CategoryApi";
import * as TagApi from "../tag/TagApi";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import moment from "moment";
import { capitalize } from "lodash";
import styles from "./Styles.module.scss";
import {
  UserOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { DateFormats } from "app/date/dateConst";
import Reviews from "./Reviews";
import Questions from "./Question";
import { COLORS } from "../common/colorConts";

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
  const [pagination, setpagination] = useState({});
  const [imageData, setImageData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState<any>([]);
  const [slectedDate, setSelectedDate] = useState<any>(undefined);
  const [visibleReview, setVisibleReview] = useState(false);
  const [visibleQuestion, setVisibleQuestion] = useState(false);

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
      render: (_name: string, record: any) => <>{record?.price}৳</>,
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
      title: "Updated Time",
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

  const onDateChange = (dates: any) => {
    setSelectedDate(dates);
  };

  const onFinish = async (values: any) => {
    if (imageData && imageData.length > 0) {
      values.image = imageData.map((image: any) => image.url);
      values.images = imageData;
    } else {
      values.image = [];
      values.images = [];
    }
    if(values.variation && values.variation.length === 0) {
      values.variation = null;
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
        discount: item.discount,
        offerEnd: item.offerEnd,
        new: item.new,
        category: item.category,
        tag: item.tag,
        is_normal_sell: item.is_normal_sell,
        is_flash_sell: item.is_flash_sell,
        is_campaign_sell: item.is_campaign_sell,
        condition: item.condition,
        shortDescription: item.shortDescription,
        shortDescription_local: item.shortDescription_local,
        fullDescriptionTitle: item.fullDescriptionTitle,
        fullDescription: item.fullDescription,
        variation: item.variation,
        youtubeLink: item.youtubeLink,
        isHomePage: item.isHomePage,
        isCollectionPage: item.isCollectionPage,
        leftSide: item.leftSide,
        rightSide: item.rightSide,
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
    if (values?.id) {
      handleEdit(values?.id);
    }
  };

  const handleCreate = (value: boolean) => {
    setCreate(value);
    setVisible(true);
    setImageData([]);
    form.setFieldsValue({
      sku: null,
      name: null,
      name_local: null,
      price: null,
      discount: null,
      offerEnd: null,
      new: true,
      category: [],
      tag: [],
      is_normal_sell: true,
      is_flash_sell: false,
      is_campaign_sell: false,
      isHomePage: false,
      isCollectionPage: true,
      youtubeLink: null,
      condition: null,
      shortDescription: null,
      shortDescription_local: null,
      fullDescriptionTitle: null,
      fullDescription: null,
      leftSide: [],
      rightSide: [],
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

  const showReviewDrawer = () => {
    setVisibleReview(true);
  };

  const closeReviewDrawer = () => {
    setVisibleReview(false);
  };

  const showQuestionDrawer = () => {
    setVisibleQuestion(true);
  };

  const closeQuestionDrawer = () => {
    setVisibleQuestion(false);
  };

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
      <Reviews
        productId={item && item.id}
        visible={visibleReview}
        closeReviewDrawer={closeReviewDrawer}
      />
      <Questions
        productId={item && item.id}
        visible={visibleQuestion}
        closeQuestionDrawer={closeQuestionDrawer}
      />

      <Drawer
        title={create ? "Create Product" : `Update Product #${item?.id}`}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={600}
      >
        <Spin spinning={loading}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Sku"
              name="sku"
              rules={[{ required: true, message: "Please give sku" }]}
            >
              <Input placeholder="Sku" />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Please give Category",
                },
              ]}
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
              rules={[
                {
                  required: true,
                  message: "Please give Tag",
                },
              ]}
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
              label="Name"
              name="name"
              rules={[
                {
                  whitespace: false,
                  required: true,
                  message: "Please give name",
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="Name Local" name="name_local">
              <Input placeholder="Name Local" />
            </Form.Item>
            <Row justify="space-between">
              <Col md={10}>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Please give price" }]}
                >
                  <Input type="number" placeholder="price" />
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item
                  label="Discount"
                  name="discount"
                  rules={[{ required: true, message: "Please give Discount" }]}
                >
                  <Input type="number" placeholder="Discount" />
                </Form.Item>
              </Col>
              <Col md={8}>
                <Form.Item
                  label="Stock"
                  name="stock"
                  rules={[{ required: true, message: "Please give Stock" }]}
                >
                  <Input type="number" placeholder="Stock" />
                </Form.Item>
              </Col>
            </Row>
            <h3>Variation</h3>
            <Form.List name="variation">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 3 }}
                      align="baseline"
                    >
                      <Form.Item {...restField} name={[name, "color"]}>
                        <Select
                          placeholder="Please select Color"
                          style={{ width: "100%" }}
                        >
                          {COLORS &&
                            COLORS.length > 0 &&
                            COLORS.map((color: any) => (
                              <Option key={color.value} value={color.value}>
                                {color.color}
                              </Option>
                            ))}
                        </Select>
                      </Form.Item>
                      <Form.List name={[key, "size"]}>
                        {(size, { add, remove }) => {
                          return (
                            <>
                              {size.map(({ key, name, ...restField }) => (
                                <Space
                                  key={key}
                                  style={{ display: "flex", marginBottom: 8 }}
                                  align="start"
                                >
                                  <Form.Item
                                    {...restField}
                                    name={[name, "name"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Size Name Missing",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="size" />
                                  </Form.Item>
                                  <Form.Item
                                    {...restField}
                                    name={[name, "stock"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Size Stock Missing",
                                      },
                                    ]}
                                  >
                                    <Input type="number" placeholder="stock" />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    onClick={() => {
                                      remove(name);
                                    }}
                                  />
                                </Space>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => {
                                    add();
                                  }}
                                >
                                  <PlusOutlined /> Add Size
                                </Button>
                              </Form.Item>
                            </>
                          );
                        }}
                      </Form.List>
                      <Button danger onClick={() => remove(name)}>
                        Delete
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Variation
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item label="Offer End" name="offerEnd">
              <Input placeholder="Offer End" />
            </Form.Item>
            <Form.Item name="new" label="Product Status">
              <Radio.Group>
                <Radio.Button value={true}>New Product</Radio.Button>
                <Radio.Button value={false}>Not New Product</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Row>
              <Col sm={8}>
                <Form.Item
                  name="is_normal_sell"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Normal Sell</Checkbox>
                </Form.Item>
              </Col>
              <Col sm={8}>
                <Form.Item name="is_flash_sell" valuePropName="checked" noStyle>
                  <Checkbox>Flash Sell</Checkbox>
                </Form.Item>
              </Col>
              <Col sm={8}>
                <Form.Item
                  name="is_campaign_sell"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Campaign Sell</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <br />
            <Row>
              <Col sm={10}>
                <Form.Item name="isHomePage" valuePropName="checked" noStyle>
                  <Checkbox>Is Home Page</Checkbox>
                </Form.Item>
              </Col>
              <Col sm={10}>
                <Form.Item
                  name="isCollectionPage"
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>Is Collection Page</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <br />
            <br />
            <Form.Item label="Condition" name="condition">
              <Input.TextArea placeholder="Condition" />
            </Form.Item>

            <Form.Item name="is_active" label="Product Activeness">
              <Radio.Group>
                <Radio.Button value={true}>Active</Radio.Button>
                <Radio.Button value={false}>InActive</Radio.Button>
              </Radio.Group>
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
            >
              <Input.TextArea placeholder="Short Description local" />
            </Form.Item>
            <Divider>Start Full Description</Divider>
            <Form.Item
              label="Title"
              name="fullDescriptionTitle"
              rules={[
                {
                  required: true,
                  message: "Please give fullDescription Title",
                },
              ]}
            >
              <Input.TextArea rows={2} placeholder="full Description" />
            </Form.Item>
            <Form.Item
              label="Full Description"
              name="fullDescription"
              rules={[
                {
                  required: true,
                  message: "Please give fullDescription",
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Full Description" />
            </Form.Item>
            <div>Left Side Description</div>
            <Form.List name="leftSide">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 3 }}
                      align="baseline"
                    >
                      <Form.Item {...restField} name={[name, "title"]}>
                        <Input placeholder="Title" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "data"]}>
                        <Input placeholder="Description" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <div>Right Side Description</div>
            <Form.List name="rightSide">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 3 }}
                      align="baseline"
                    >
                      <Form.Item {...restField} name={[name, "title"]}>
                        <Input placeholder="Title" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, "data"]}>
                        <Input placeholder="Description" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Divider>End Full Description</Divider>

            <Form.Item label="Youtube Video ID" name="youtubeLink">
              <Input placeholder="Youtube video ID" />
            </Form.Item>

            <br />
            <Alert
              message="If you add/delete image please Click Update/Create Button in the below otherwise image would not be saved"
              type="success"
            />
            <Form.Item label="Image" rules={[{ message: "Please give Image" }]}>
              <ImageUploader
                data={imageData}
                maxImageNumber={6}
                uploadPreset="products"
                handleImages={getImages}
              />
            </Form.Item>

            <Divider>Updated Information</Divider>

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

                {!create && (
                  <>
                    <Button type="primary" onClick={showReviewDrawer}>
                      Reviews
                    </Button>
                    <Button type="primary" onClick={showQuestionDrawer}>
                      Questions
                    </Button>
                    <Popconfirm
                      title="Are you sure want to delete"
                      onConfirm={confirm}
                    >
                      <Button danger> Delete </Button>{" "}
                    </Popconfirm>
                  </>
                )}
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
          pagination={pagination}
          loading={loading}
          columns={columns}
          dataSource={items}
        />
      </Spin>
    </Card>
  );
}
