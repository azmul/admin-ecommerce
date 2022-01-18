import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  message,
  Row,
  Col,
  Spin,
  Form,
  Input,
  Button,
  Space,
} from "antd";
import * as SettingApi from "./SettingApi";
import moment from "moment";
import {capitalize} from "lodash";

export default function SettingPage() {
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const [item, setItem] = useState<any>(undefined);

  const onFinish = async (values: any) => {
    setloading(true);
    try{
      await SettingApi.updateItem(values);
      message.success("Setting Updated successfully");
    } finally{
      setloading(false);
    }
  };

  const getItems = useCallback(
    async () => {
      try {
        setloading(true);
        const item: any = await SettingApi.getItem();
        setItem(item);
        form.setFieldsValue({
          call_us_number: item?.call_us_number,
          free_delivery_money: item?.free_delivery_money,
          contact_number1: item?.contact_number1,
          contact_number2: item?.contact_number2,
          business_email: item?.business_email,
          business_site: item?.business_site,
          business_main_address: item?.business_main_address,
          facebook_link: item?.facebook_link,
          youtube_link: item?.youtube_link,
          twitter_link: item?.twitter_link,
          instagram_link: item?.instagram_link,
          pinterest_link: item?.pinterest_link,
        });
      } catch (error: any) {
        message.error(error?.message);
      } finally {
        setloading(false);
      }
    },
    [form]
  );

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card>
      <Spin spinning={loading}>
        <h3>Last updatedAt: {capitalize(moment(item?.updatedAt).fromNow())}</h3>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Call Us Number" name="call_us_number">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Free Delivery Money" name="free_delivery_money">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Contact Number 1" name="contact_number1">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Contact Number 1" name="contact_number2">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Business Email" name="business_email">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Business Site Link" name="business_site">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={24}>
              <Form.Item
                label="business Main Address"
                name="business_main_address"
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Facebook Link" name="facebook_link">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Youtube Link" name="youtube_link">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Twitter Link" name="twitter_link">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Instagram Link" name="instagram_link">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Pinterest Link" name="pinterest_link">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space size="middle">
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}
