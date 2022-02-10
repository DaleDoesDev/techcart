import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import StarFilter from "../../components/forms/StarFilter";
import StarRating from "react-star-ratings";

const starClick = jest.fn();

const wrapper = mount(<StarFilter numberOfStars={5} starClick={starClick} />);

describe("StarFilter form", () => {
  const starRatingComponent = wrapper.find(StarRating);
  test("StarFilter renders", () => {
    expect(starRatingComponent.length).toBe(1);
    expect(starRatingComponent.props().numberOfStars).toBe(5);
  });

  test("StarFilter changeRating", () => {
    starRatingComponent.props().changeRating();
    expect(starClick).toHaveBeenCalledWith(5);
  });
});
