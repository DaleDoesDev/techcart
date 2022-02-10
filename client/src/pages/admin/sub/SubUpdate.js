import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { updateSub, getSub } from "../../../utilities/sub";
import { getCategories } from "../../../utilities/category";
import { handleError } from "../../../utilities/handleError";
import CategoryForm from "../../../components/forms/CategoryForm";
import { LoadingOutlined } from "@ant-design/icons";

const SubUpdate = ({ match, history }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");

  const { user } = useSelector((state) => state);

  useEffect(() => {
    loadCategories();
    //load sub
    getSub(match.params.slug).then((res) => {
      setName(res.data.name);
      setParent(res.data.parent);
    });
  }, [match.params.slug]);

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (parent) {
      updateSub(match.params.slug, { name, parent }, user.token)
        .then((res) => {
          setLoading(false);
          setName("");
          toast.success(
            `Subcategory "${res.data.name}" was updated successfully.`
          );
          history.push("/admin/sub");
        })
        .catch((err) => {
          setLoading(false);
          handleError(err);
        });
    } else {
      setLoading(false);
      toast.error("You must select a parent category for this subcategory.");
    }
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
              <h4 className="mt-3">Update Subcategory</h4>
            )}

            <CategoryForm
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
            />

            <div className="form-group">
              <label>Parent Category</label>
              <select
                name="category"
                title="parent category"
                className="form-control"
                onChange={(e) => setParent(e.target.value)}
                value={parent}
              >
                <option value="">Please select.</option>
                {categories.length > 0 &&
                  categories.map((category) => {
                    return (
                      <option
                        key={category._id}
                        title="category option"
                        value={
                          category._id /*used to identify current selection*/
                        }
                      >
                        {category.name}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubUpdate;
