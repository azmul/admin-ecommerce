import React from "react";
import { Tabs, Card, Row, Col } from 'antd';
import Login from "app/components/login/Login";
import Register from "app/components/register/Register";
import useTranslation from 'next-translate/useTranslation'

const { TabPane } = Tabs;

export default function LoginPage() {
  const { t } = useTranslation('ns1');
  
  return (
    <Tabs defaultActiveKey="1"  type="card">
    <TabPane tab={t("login:login")} key="1">  
      <Row>
        <Col xs={24} sm={24} md={19}>
          <Card>
            <Login />
          </Card>
        </Col>
       </Row>
    </TabPane>
    <TabPane tab={t("login:register")} key="2">
    <Row>
        <Col xs={24} sm={24} md={16}>
         <Card>
        <Register  />
       </Card>
       </Col>
       </Row>
    </TabPane>
  </Tabs>
  )
} 
