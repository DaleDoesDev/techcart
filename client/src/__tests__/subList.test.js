import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import {waitFor} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';

import SubList from "../components/sub/SubList";

jest.mock('../utilities/sub', () => ({
  getSubs: () => Promise.resolve({
      "data": [
        { 
          "name": "sub",
          "slug": "test-sub",
          "_id": 3452
        }
      ]
    }
  )
})); 

beforeAll(async () => {
  await waitFor(() => mount(
      <MemoryRouter>
        <SubList />
      </MemoryRouter>
    )
  )
})

describe("SubList", () => {
  test("renders alone without crash", async () => {
  })
})