import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import {waitFor} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';

import CategoryList from "../components/category/CategoryList";

jest.mock('../utilities/category', () => ({
  getCategories: () => Promise.resolve({
      "data": [
        { 
          "name": "test_category",
          "slug": "test-category"
        }
      ]
    }
  )
})); 

beforeAll(async () => {
  await waitFor(() => mount(
      <MemoryRouter>
        <CategoryList />
      </MemoryRouter>
    )
  )
})

describe("CategoryList", () => {
  test("renders alone without crash", async () => {
  })
})