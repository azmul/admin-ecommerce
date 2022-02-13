
import React, { useState } from "react";
import { Form, Input, Button, message } from 'antd';
import Link from 'next/link'
import styles from "./Login.module.scss";
import { useRouter } from 'next/router'
import { LoginRequestType } from "./LoginType";
import * as loginApi from "./LoginApi";
import { useStore } from "redux/hooks";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import useTranslation from 'next-translate/useTranslation'

const Login = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { dispatch } = useStore();
  const { t } = useTranslation('ns1');

  const [isSubmit, setIsSubmit] = useState(false);

      const onFinish = async (values: LoginRequestType) => {
        try {
          setIsSubmit(true);

          const response: any =  await loginApi.adminLogin(values);

          dispatch.authModel.setProfile(response?.data);
          dispatch.authModel.setToken(response?.token);


          message.success({
            content: "Sucessfully Login",
            style: {
              marginTop: '10vh',
            },
            duration: 5,
          });

          form.resetFields();
          router.push('/');
          
         } catch(error: any) {
           message.error(error?.message);
         } finally {
          setIsSubmit(false);
         }
      };
    
      return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div  className={styles.loginForm}>
        <Form
          name="login"
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >

          <Form.Item
            label={t("form:phoneNumber")}
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input placeholder="0xxxxxxxxxx" prefix={"+88"} />
          </Form.Item>
    
          <Form.Item
             label={t("form:password")}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
    
          <Form.Item>
            <Button type="primary" loading={isSubmit} htmlType="submit">
              {t("form:login")}
            </Button>
          </Form.Item>
        </Form>
        <Link href="/recovery">
          {t("form:lostPassword")}
        </Link>
        </div>
        </ErrorBoundary>
      );
}

export default Login;