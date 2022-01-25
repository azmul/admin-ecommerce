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
  Divider,
  Checkbox,
} from "antd";
import * as SettingApi from "./SettingApi";
import moment from "moment";
import { capitalize } from "lodash";

export default function SettingPage() {
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const [item, setItem] = useState<any>(undefined);

  const onFinish = async (values: any) => {
    setloading(true);
    try {
      await SettingApi.updateItem(values);
      message.success("Setting Updated successfully");
    } finally {
      setloading(false);
    }
  };

  const getItems = useCallback(async () => {
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
        bkash_number: item?.bkash_number,
        nagad_number: item?.nagad_number,
        rocket_number: item?.rocket_number,
        bkash_discount: item?.bkash_discount,
        nagad_discount: item?.nagad_discount,
        rocket_discount: item?.rocket_discount,
        is_campaign_sell: item?.is_campaign_sell,
        is_flash_sell: item?.is_flash_sell,
      });
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setloading(false);
    }
  }, [form]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card>
      <Spin spinning={loading}>
        <h3>Last updatedAt: {capitalize(moment(item?.updatedAt).fromNow())}</h3>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Divider orientation="left">Call Center Information</Divider>
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
          <Divider orientation="left">Payment Information</Divider>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Bkash Number" name="bkash_number">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Bkash Discount %" name="bkash_discount">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Nagad Number" name="nagad_number">
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Nagad Discount %" name="nagad_discount">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col xs={24} sm={11}>
              <Form.Item label="Rocket Number" name="rocket_number">
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Rocket Discount %" name="rocket_discount">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">Business Address Information</Divider>
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
          <Divider orientation="left">Social Information</Divider>
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
          <Divider orientation="left">Sell Options</Divider>
          <Row>
            <Col xs={24} sm={8}>
              <Form.Item
                name="is_campaign_sell"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Campaign Sell</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="is_flash_sell" valuePropName="checked" noStyle>
                <Checkbox>Flash Sell</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Divider />
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
