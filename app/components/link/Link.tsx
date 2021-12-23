import React, {useCallback, useEffect, useState} from "react";
import { Card, message, Spin, Form, Input, Button } from "antd";
import * as linkApi from "./LinkApi";
import { UserOutlined } from '@ant-design/icons';
import useTranslation from 'next-translate/useTranslation'

export default function Link() {
    const [count, setcount] = useState(0)
    const [loading, setloading] = useState(false);
    const [form] = Form.useForm();
    const { t } = useTranslation('ns1');

    const getLinksCount = useCallback( async () => {
      try {
        setloading(true);
        const response: any = await linkApi.countInactiveLink();
        setcount(response?.count)
      } catch(error: any) {
        message.error(error?.message);
      } finally {
        setloading(false);
      }
    },[])

    useEffect(() => {
        getLinksCount();
    },[getLinksCount])

    const onFinish = async (values: any) => {
        try {
            setloading(true);
            await linkApi.createLink(values);
            setcount(count+1);
            message.success({
                content: t("form:linkCreateSucess"),
                style: {
                  marginTop: '10vh',
                },
                duration: 5,
              });
            form.resetFields();
        } catch(error: any) {
           message.error(error?.message);
        } finally {
           setloading(false);
        }
    }

    return(
        <Card>
            <Spin spinning={loading}>
             <p>{t("form:totalRemainLink")}:  <b>{count}</b></p>
             <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="link"
                    rules={[{ required: true, message: t("form:linkVerification")}]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t("form:linkVerification")} />
                </Form.Item>
                <Form.Item >
                    <Button
                    type="primary"
                    htmlType="submit"
                    >
                     {t("form:save")}
                    </Button>
                </Form.Item>
                </Form>
           </Spin>
        </Card>
    )
}