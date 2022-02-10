import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategory, updateCategory } from "../../../utilities/category";
import { handleError } from "../../../utilities/handleError";
import CategoryForm from "../../../components/forms/CategoryForm";
import { LoadingOutlined } from "@ant-design/icons";

const CategoryUpdate = ({ history, match }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state);

  useEffect(() => {
    getCategory(match.params.slug).then((res) => setName(res.data.name));
  }, [match.params.slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateCategory(match.params.slug, { name: name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`Category "${res.data.name}" was updated successfully.`);
        history.push("/admin/category");
      })
      .catch((err) => {
        setLoading(false);
        handleError(err);
      });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <AdminNav />
          </div>
          <div className="col">
            {loading ? (
              <LoadingOutlined className="h1" />
            ) : (
              <h4 className="mt-3">Update Category</h4>
            )}
            <CategoryForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />
            <hr />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryUpdate;
