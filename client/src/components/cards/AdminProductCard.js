import React from "react";
import { Card } from "antd";
import laptop from "../../images/laptop.png";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
  let { title, images, slug, price } = product;

  return (
    <Card
      className="text-center mb-3"
      bordered={false}
      cover={
        <img
          className="p-1"
          style={{ height: "150px", objectFit: "contain" }}
          src={images && images.length ? images[0].url : laptop}
          alt="product"
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-primary" />
        </Link>,
        <DeleteOutlined
          className="text-danger"
          onClick={() => handleRemove(slug)}
        />,
      ]}
    >
      <Meta
        title={title}
        description={price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      />
    </Card>
  );
};

export default AdminProductCard;
