import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import {waitFor} from '@testing-library/react'

import CouponBanner from '../components/coupon/CouponBanner';

jest.mock('../utilities/coupon', () => ({
  getCoupons: () => Promise.resolve({
      "data": [
        { 
          "name": "test_coupon",
          "discount": 5,
          "expire": "2022-01-12T23:21:26.403+00:00"
        }
      ]
    }
  ) //
})); 

beforeAll(async () => {
  await waitFor(() => mount(
        <CouponBanner />
    )
  )
})

describe("CouponBanner", () => {
  test("renders alone without crash", async () => {
  })
})

