
import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message, Card } from 'antd';
import Link from "next/link"
import styles from "./Recovery.module.scss";
import * as recoverApi from "./RecoverApi";
import { RecoverPasswordRequestType } from "./RecoverType";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import useTranslation from 'next-translate/useTranslation'

const Recovery = () => {
  const [form] = Form.useForm();
  const [isSendOtp, setIsSendOtp] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { t } = useTranslation('ns1');

      const onFinish = async (values: RecoverPasswordRequestType) => {
        try {
          setIsSubmit(true);
           await recoverApi.adminRecoverPassword(values)

           const content = `Successfully Password Recovered`

          message.success({
            content,
            style: {
              marginTop: '20vh',
            },
            duration: 5,
          });

          form.resetFields();
          
         } catch(error: any) {
           message.error(error?.message);
         } finally {
          setIsSubmit(false);
         }
      };

      return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Card className={styles.recoveryForm} title={t("form:resetPassword")}>
        <Form
          name="recovery"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
           <Row justify="space-between">
              <Col xs={24} md={17}>
                <Form.Item
                  label={t("form:phoneNumber")}
                  name="phone"
                  rules={[{ required: true, message: t("form:phoneNumberVerification") }]}
                >
                   <Input type="number" placeholder="0xxxxxxxxxx" addonBefore={"+88"} />
               </Form.Item>
              </Col>
            </Row>
    
          <Form.Item
             label={t("form:newPassword")}
            name="password"
            rules={[{ required: true, message: t("form:newPasswordVerification") }]}
          >
            <Input.Password />
          </Form.Item>
    
          <Form.Item>
            <Button type="primary" loading={isSubmit} htmlType="submit">
              {t("form:recovery")}
            </Button>
          </Form.Item>
        </Form>
        <Link href="/login">
           {t("form:backToLogin")}
        </Link>
        </Card>
        </ErrorBoundary>
      );
}

export default Recovery;