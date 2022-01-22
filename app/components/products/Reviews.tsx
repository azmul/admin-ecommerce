import { useEffect, useCallback, useState } from "react";
import { Drawer, Spin, List, Skeleton, Avatar, Rate, Popconfirm, message } from "antd";
import * as ReviewApi from "./ReviewApi";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import {capitalize, remove} from "lodash";

type Props = {
  visible: boolean;
  closeReviewDrawer(isVisible: boolean): void;
  productId: number;
};

export default function Reviews({
  visible,
  closeReviewDrawer,
  productId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [reviewItem, setReviewItem] = useState<any>(undefined);
  const [review, setReview] = useState<any>([]);
  const closeDrawer = () => {
    closeReviewDrawer(false);
  };

  const getReviews = useCallback(async (productId: number) => {
    try {
      setLoading(true);
      const response: any = await ReviewApi.getReviewByProductId(productId);
      setReviewItem(response);
      if (response && response?.reviews) {
        setReview(response.reviews);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReview = async (item: any) => {
    try {
        setLoading(true);
        await ReviewApi.updateReviewItem(reviewItem._id, {
          id: item.id,
          isDeleted: true,
        });
        remove(
          review,
          (i: any) => Number(i.id) === Number(item.id)
        );
        setReview(review);
        message.success("Review deleted successfully");
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    if (visible) {
      getReviews(productId);
    }
  }, [getReviews, productId, visible]);

  return (
    <Spin spinning={loading}>
      <Drawer
        title="Review List"
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={560}
      >
        {review && review.length > 0 ? (
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={review}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Rate disabled key="rate" value={item.rating} />,
                  <Popconfirm
          key={Math.random()}
          title="Are you sure to delete this review?"
          onConfirm={() => deleteReview(item)}
          okText="Yes"
          cancelText="No"
        >
          <a href="#">Delete</a>
        </Popconfirm>
                ]}
              >
                <Skeleton avatar loading={loading} title={false} active>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`${item.customerName} (${item.customerPhone}) ${capitalize(moment(item.createdAt).fromNow())}`}
                    description={item.message}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        ) : (
          "There is no reviews"
        )}
      </Drawer>
    </Spin>
  );
}
