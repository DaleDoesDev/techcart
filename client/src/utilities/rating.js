//this is used in <ProductCard/>
import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (product) => {
  if (product && product.ratings) {
    let total = []; //will hold the integer star ratings from the product.ratings objects

    product.ratings.map((rating) => {
      return total.push(rating.star);
    });

    //sum all the star ratings for this product
    let totalStars = total.reduce((p, n) => {
      return p + n;
    }, 0); //2nd arg is the initial value (0)

    //the highest possible total of stars the product could have
    let highestPossible = product.ratings.length * 5;

    let result = (totalStars * 5) / highestPossible;

    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            data-type="rate"
            numberOfStars={5}
            rating={result}
            isSelectable={false}
            starRatedColor="#f44336"
            starDimension="20px"
            starSpacing="1px"
          />{" "}
          <span className="text-muted">({product.ratings.length})</span>
        </span>
      </div>
    );
  } //end if
};
