import React from "react";
import { Card, Skeleton } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";

//return an array of <Skeleton> loading components with a length of props.count
const LoadingCard = ({ count }) => {
  const cards = () => {
    let totalCards = [];

    for (let i = 0; i < count; i++) {
      totalCards.push(
        <Card
          className="text-center col m-3"
          key={i}
          bordered={false}
          cover={
            <Skeleton.Image
              className="p-1"
              style={{
                height: "150px",
                width: "150px",
                objectFit: "contain",
              }}
            />
          }
          actions={[
            <div>
              <EyeOutlined key="setting" /> <br /> View Product
            </div>,
            <div>
              <ShoppingCartOutlined key="setting" /> <br /> Add to Cart
            </div>,
          ]}
        >
          <Skeleton
            active
            className="m-auto text-center"
            paragraph={{ rows: 1 }}
          />
        </Card>
      );
    }
    return totalCards;
  };

  return <div className="row">{cards()}</div>;
};

export default LoadingCard;
