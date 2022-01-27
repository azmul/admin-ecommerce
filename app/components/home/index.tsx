import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  message,
  Spin,
  Table,
} from "antd";
import * as homeApi from "./homeApi";
import moment from "moment";

export default function Link() {
  const [loading, setloading] = useState(false);
  const [items, setItems] = useState([]);

  const columns: any = [
    {
      title: "Admin's Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Admin's Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Verified?",
      dataIndex: "is_approved",
      key: "is_approved",
      // eslint-disable-next-line react/display-name
      render: (_name: string, record: any) =>
        record?.is_approved ? "Yes" : "No",
    },
    {
      title: "Registered Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_name: string, record: any) =>
        moment(record?.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    }
  ];

  const getItems = useCallback(
    async () => {
      try {
        setloading(true);
        const response: any = await homeApi.getItems();
        setItems(response?.data);
      } catch (error: any) {
        message.error(error?.message);
      } finally {
        setloading(false);
      }
    },
    []
  );


  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Card title="Admin's Information List">
      <Spin spinning={loading}>
        <Table
          onChange={getItems}
          pagination={false}
          loading={loading}
          columns={columns}
          dataSource={items}
        />
      </Spin>
    </Card>
  );
}
