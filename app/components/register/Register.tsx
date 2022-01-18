
import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message } from 'antd';
import styles from "./Register.module.scss";
import * as registerApi from "./registerApi";
import { RegisterRequestType } from "./RegisterTye";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import useTranslation from 'next-translate/useTranslation'

const Register = () => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { t } = useTranslation('ns1');

      const onFinish = async (values: RegisterRequestType) => {
         try {
          setIsSubmit(true);
          const response: any =  await registerApi.adminRegister(values);

          message.success({
            content: "Sucessfully Registered",
            style: {
              marginTop: '20vh',
            },
            duration: 2,
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
      <div className={styles.registerForm}>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
        
        >
          <Form.Item
            label={t("form:fullName")}
            name="name"
            rules={[{ required: true, message: t("form:fullNameVerification")  }]}
          >
            <Input />
          </Form.Item>

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
             label={t("form:password")}
            name="password"
            rules={[{ required: true, message: t("form:passwordVerification")}]}
          >
            <Input.Password />
          </Form.Item>
    
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmit}>
            {t("form:register") }
            </Button>
          </Form.Item>
        </Form>
        </div>
        </ErrorBoundary>
      );
}

export default Register;