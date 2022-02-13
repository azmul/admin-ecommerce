import React, { useState } from "react";
import { Form, Input, Button, Card, message} from 'antd';
import * as changePasswordApi from "./ChangePasswordApi";
import { ChangePasswordType } from "./ChangePasswordType";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../ui/ErrorFallback"
import useTranslation from 'next-translate/useTranslation'

const ChangePassword = () => {
  const { t } = useTranslation('ns1');
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  const role: number = useSelector(
    (state: RootState) => state.authModel.role
  ) ;

      const onFinish = async (values: ChangePasswordType) => {
        setIsSubmit(true);
          try{
           await changePasswordApi.changeAdminPassword(values)

          message.success({
            content: t("form:profileSaveSucess"),
            style: {
              marginTop: '10vh',
            },
            duration: 3,
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
       <Card>
        <Form
          name="login"
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
      
      <Form.Item
        name="current"
        label={t("form:currentPassword")}
        rules={[
        {
            required: true,
            message: t("form:passwordVerification"),
        },
        ]}
        hasFeedback
        >
        <Input.Password />
      </Form.Item>

       <Form.Item
        name="password"
        label={t("form:newPassword")}
        rules={[
        {
            required: true,
            message: t("form:newPasswordVerification"),
        },
        ]}
        hasFeedback
        >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label={t("form:confirmPassword")}
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message:  t("form:newPasswordVerification"),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("form:passwordMatch")));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
          <Form.Item>
            <Button type="primary" loading={isSubmit} htmlType="submit">
               {t("form:changePassword")}
            </Button>
          </Form.Item>
        </Form>
        </Card>
        </ErrorBoundary>
      );
}

export default ChangePassword;