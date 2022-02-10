import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { handleError } from "../../utilities/handleError";
import { Avatar, Badge } from "antd";
import { toast } from "react-toastify";

const FileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => {
    return state;
  });

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          1080,
          1080,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                {
                  image: uri, //the resized image
                },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                setLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
                e.target.value = ""; //ensure the onChange fires for every image upload
              })
              .catch((err) => {
                setLoading(false);
                handleError(err);
              });
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        //update the images array in the state
        setValues({
          ...values,
          images: values.images.filter((i) => {
            return i.public_id !== public_id;
          }),
        });
        toast.success("The image was deleted successfully.");
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((img) => {
            return (
              <Badge
                count="X"
                key={img.public_id}
                onClick={() => handleImageRemove(img.public_id)}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  src={img.url}
                  size={100}
                  shape="square"
                  className="mb-3 ml-3"
                />
              </Badge>
            );
          })}
      </div>
      <div className="row">
        <label className="btn btn-danger btn-raised">
          Choose File
          <input
            type="file"
            multiple
            accept="images/*"
            onChange={fileUploadAndResize}
            hidden
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
