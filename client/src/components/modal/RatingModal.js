import React from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

//child component of SingleProduct
const RatingModal = ({ modalVisible, setModalVisible, children }) => {
  const { user } = useSelector((state) => {
    
    return state;
  });

  let history = useHistory();
  let { slug } = useParams();

  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      //the below is handled on pages/login
      history.push({
        pathname: "/login", //send to login now and...
        state: {
          //...this saves the desired page to redirect back to
          from: `/product/${slug}`,
        },
      });
    }
  };

  return (
    <>
      <div onClick={handleModal} title="rate">
        <StarOutlined className="text-warning" /> <br />{" "}
        {user ? "Rate" : "Login to Rate"}
      </div>
      <Modal
        title="Leave your rating"
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default RatingModal;
