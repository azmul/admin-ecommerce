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
  Tooltip,
  Comment,
  List,
  Avatar
} from "antd";
import * as BlogApi from "./BlogApi";
import useTranslation from "next-translate/useTranslation";
import ImageUploader from "../imageUploader";
import * as CategoryApi from "../category/CategoryApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import moment from "moment";
import { capitalize, remove } from "lodash";
import styles from "./Styles.module.scss";
import { UserOutlined } from "@ant-design/icons";
import { DateFormats } from "../../date/dateConst";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Link() {
  const [visible, setVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const { t } = useTranslation("ns1");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState<any>(undefined);
  const [params, setParams] = useState<any>(undefined);
  const [pagination, setpagination] = useState({});
  const [imageData, setImageData] = useState<any>([]);
  const [categories, setCategories] = useState([]);
  const [slectedDate, setSelectedDate] = useState<any>(undefined);
  const [commentVisible, setCommentVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [itemComments, setItemComments] = useState([]);

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
      title: "Creator Name",
      dataIndex: "creator_name",
      key: "creator_name",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.is_active ? (
          record?.creator_name
        ) : (
          <del>{record?.creator_name}</del>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "tile",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
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
      values.picture_url = imageData[0].url;
    } else {
      values.picture_url = undefined;
    }
    try {
      setloading(true);
      values.last_updated_by = profile?.name;

      create
        ? await BlogApi.createItem(values)
        : await BlogApi.updateItem(item?._id, values);

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
      message.error("Blog Not Found");
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
      const item: any = await BlogApi.getItem(id);
      form.setFieldsValue({
        title: item.title,
        title_local: item.title_local,
        content: item.content,
        content_local: item.content_local,
        creator_name: item.creator_name,
        category: item.category,
        like_count: item.like_count,
        is_active: item.is_active,
        comment: item.comment,
      });

      setItem(item);
      setItemComments(item?.comments);
      setImageData([
        {
          url: item.picture_url,
          uid: item.uid,
          name: item.title,
        },
      ]);
    } catch (error: any) {
      setVisible(false);
      message.error(error?.message);
      message.error("Blog Not Found");
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
      title: null,
      title_local: null,
      content: null,
      content_local: null,
      category: null,
      creator_name: null,
      like_count: null,
      is_active: null,
      comment: null,
    });
  };

  const confirm = async () => {
    try {
      setloading(true);
      await BlogApi.deleteItem(item?._id);
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

  const closeCommentDrawer = () => {
    setCommentVisible(false);
  };

  const createCommentList = (comments: any) => {
    const data = comments.map((comment: any) => ({
      actions: [
        <Popconfirm
          key={Math.random()}
          title="Are you sure to delete this comment?"
          onConfirm={() => deleteComment(comment)}
          okText="Yes"
          cancelText="No"
        >
          <a href="#">Delete</a>
        </Popconfirm>,
      ],
      author: `${comment.customerName} (${comment.customerPhone})`,
      avatar: (
        <>
          {" "}
          <Avatar icon={<UserOutlined />} />
        </>
      ),
      content: <p>{comment.comment}</p>,
      datetime: (
        <Tooltip
          title={moment(comment.createdAt).format("YYYY-MM-DD HH:mm:ss")}
        >
          <span>{moment(comment.createdAt).fromNow()}</span>
        </Tooltip>
      ),
    }));
    setComments(data);
  };

  const deleteComment = async (comment: any) => {
    try {
      setItemComments([]);
      setLoadingComment(true);
      await BlogApi.updateCommentItem(item._id, {
        blogId: item.id,
        isDeleted: true,
      });
      remove(
        itemComments,
        (item: any) => Number(item.id) === Number(comment.id)
      );
      setItemComments(itemComments);
      createCommentList(itemComments);
      message.success("Comment deleted successfully");
    } finally {
      setLoadingComment(false);
    }
  };

  const openCommentDrawer = () => {
    if (item?.comments && item.comments.length > 0) {
      createCommentList(item.comments);
    }
    setCommentVisible(true);
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
        const response: any = await BlogApi.getItems({ ...query });
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

  useEffect(() => {
    getItems();
    getCategories();
  }, [getItems, getCategories]);

  return (
    <Card
      title="Blogs List"
      extra={
        <Button type="primary" onClick={() => handleCreate(true)}>
          Create New
        </Button>
      }
    >
      <Drawer
        title={create ? "Create Blog" : "Update Blog"}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={550}
      >
        <Spin spinning={loading}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Title Local" name="title_local">
              <Input />
            </Form.Item>
            <Form.Item
              label="Content Local"
              name="content"
              rules={[{ required: true, message: "Please give content" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Content Local" name="content_local">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Like Count"
              name="like_count"
              rules={[{ required: true, message: "Please give like_count" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Creator Name"
              name="creator_name"
              rules={[{ required: true, message: "Please give creator name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Image" rules={[{ message: "Please give Image" }]}>
              <ImageUploader
                data={imageData}
                maxImageNumber={1}
                uploadPreset="blogs"
                handleImages={getImages}
              />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please give Category" }]}
            >
              <Select
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
                <Button type="primary" onClick={openCommentDrawer}>
                  Comments
                </Button>
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

      <Drawer
        title="Comments List"
        placement="right"
        onClose={closeCommentDrawer}
        visible={commentVisible}
        width={500}
      >
        <Spin spinning={loadingComment}>
          {comments && comments.length > 0 ? (
            <List
              className="comment-list"
              header={`${comments.length} replies`}
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item: any) => (
                <li>
                  <Comment
                    actions={item.actions}
                    author={item.author}
                    avatar={item.avatar}
                    content={item.content}
                    datetime={item.datetime}
                  />
                </li>
              )}
            />
          ) : (
            "There is no comment"
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
              rules={[{ required: true, message: "Give Blog Numeric ID" }]}
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
