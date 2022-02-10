//this star "form" is used on the Shop page as a filter.
import React from "react";
import StarRating from "react-star-ratings";

const Star = ({ starClick, numberOfStars }) => {
  return (
    <>
      <StarRating
        changeRating={() => starClick(numberOfStars)}
        numberOfStars={numberOfStars}
        starEmptyColor="#f44336"
        starHoverColor="#f44336"
        starDimension="20px" //they're bigger here when displayed in a modal
        starSpacing="2px"
      />
      <br />
    </>
  );
};
export default Star;
