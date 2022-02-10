import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlignTop from "../AlignTop";

const ProductListItems = ({ product }) => {
  const { price, category, subs, colors, brand } = product;
  const [priceCents, setPriceCents] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [colorsStr, setColorsStr] = useState("");

  useEffect(() => {
    let stringPrice = "";
    //format a string of all available product colors
    if (colors) {
      let str = "";
      for (let i = 0; i < colors.length; i++) {
        if (i < colors.length - 1) str += `${colors[i]}, `;
        else str += `${colors[i]}`;
      }
      setColorsStr(str);
    }

    if (price) {
      stringPrice = price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      stringPrice = stringPrice.slice(1, stringPrice.length); //drop the $

      setPriceDollars(stringPrice.slice(0, stringPrice.indexOf(".")));
      setPriceCents(
        stringPrice.slice(stringPrice.indexOf("."), stringPrice.length + 1)
      );
    }
  }, [price, colors]);

  return (
    <>
      <ul className="list-group">
        <li className="list-group-item">
          Price:{" "}
          <span className="label label-default label-pill pull-xs-right">
            {priceCents !== "" && <AlignTop content={"$"} />}
            <b className="h4 font-weight-bold">
              {priceCents !== "" ? priceDollars : "$" + priceDollars}
            </b>
            <AlignTop content={priceCents} />
          </span>
        </li>
        {category && (
          <li className="list-group-item">
            Category:{" "}
            <Link
              to={`/category/${category.slug}`}
              className="label label-default label-pill pull-xs-right"
            >
              {category.name}
            </Link>
          </li>
        )}

        {subs && subs.length > 0 && (
          <li className="list-group-item">
            Sub Categories:
            {subs.map((s, i) => (
              <Link
                to={`/sub/${s.slug}`}
                className="label label-default label-pill pull-xs-right"
                key={i}
              >
                {s.name}
              </Link>
            ))}
          </li>
        )}

        {colors && colors.length > 0 && (
          <li className="list-group-item">
            Colors:
            <span className="label label-default label-pill pull-xs-right">
              {colorsStr}
            </span>
          </li>
        )}

        <li className="list-group-item">
          Brand:{" "}
          <span className="label label-default label-pill pull-xs-right">
            {brand && brand.name}
          </span>
        </li>
      </ul>
    </>
  );
};

export default ProductListItems;
