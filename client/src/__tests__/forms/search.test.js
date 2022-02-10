import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import { Provider } from "react-redux"
import { createStore } from "redux";
import rootReducer from "../../reducers";
const store = createStore(rootReducer);
import { MemoryRouter } from 'react-router-dom';

import Search from '../../components/forms/Search';
import { SearchOutlined } from "@ant-design/icons";
 

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const wrapper = mount(
  <Provider store={store}>
    <MemoryRouter>
      <Search />
    </MemoryRouter>
  </Provider>
)

describe("search form", () => {
  const form = wrapper.find("form")
  const inputBtn = wrapper.find({title: "query"});
  const searchBtn = wrapper.find(SearchOutlined)

  test("Search renders",() => {
    expect(form.length).toBe(1);
    expect(inputBtn.length).toBe(1);
    expect(searchBtn.length).toBe(1);
  })

  test("Search onChange and submit can process",() => {
    inputBtn.simulate("change", {target: {value: 'a'}})
    searchBtn.simulate("click");
    expect(mockHistoryPush).toHaveBeenCalledWith('/shop?a');
  })

})