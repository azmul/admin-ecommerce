import { useEffect, useCallback, useState } from "react";
import { Drawer, Spin, List, Skeleton, Avatar, Rate, Popconfirm, message } from "antd";
import * as QuestionApi from "./QuestionApi";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import {capitalize} from "lodash";

type Props = {
  visible: boolean;
  closeQuestionDrawer(isVisible: boolean): void;
  productId: number;
};

export default function Questions({
  visible,
  closeQuestionDrawer,
  productId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [Question, setQuestion] = useState<any>([]);
  const closeDrawer = () => {
    closeQuestionDrawer(false);
  };

  const getQuestions = useCallback(async (productId: number) => {
    try {
        setQuestion(undefined,)
      setLoading(true);
      const response: any = await QuestionApi.getQuestionByProductId(productId);
      if (response && response?.questions) {
        setQuestion(response.questions);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      getQuestions(productId);
    }
  }, [getQuestions, productId, visible]);

  return (
    <Spin spinning={loading}>
      <Drawer
        title="Question List"
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={560}
      >
        {Question && Question.length > 0 ? (
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={Question}
            renderItem={(item: any) => (
              <List.Item
              >
                <Skeleton avatar loading={loading} title={false} active>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${item.customerName} (${item.customerPhone}) ${capitalize(moment(item.createdAt).fromNow())}`}
                    description={<><p>Question: {item.ques}</p><p>Answer: {item.ans}</p></>}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        ) : (
          "There is no Questions"
        )}
      </Drawer>
    </Spin>
  );
}
