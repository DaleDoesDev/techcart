import React from "react";
import { Provider } from "react-redux"
import Enzyme, { shallow, mount, render } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });

import { createStore } from "redux";
import rootReducer from "../reducers";
import { Modal } from "antd";
const store = createStore(rootReducer);

store.dispatch({
  type: "LOGGED_IN_USER",
  payload: {
    "_id": "1515",
    "role": "admin",
    "cart": [],
    "wishlist": [],
    "email": "test@gmail.com",
    "name": "test",
    "token": "example123",
    "address": { "address": "123 Example St.", "zip": 12345 }
  }
})

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useParams: jest.fn().mockReturnValue({ environment: 'dev', service: 'fakeService', })
}));

import RatingModal from "../components/modal/RatingModal"; 

const modalVisible = true;
const setModalVisible = jest.fn();

const wrapper = mount(
  <Provider store={store}>
    <RatingModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
  </Provider>
)

describe("Orders", () => {
  const modalComponent = wrapper.find(Modal);
  const modalContainer = wrapper.find({title: "rate"})

  test("renders", async () => {
    expect(modalComponent.length).toBe(1)
  })

  test("modal onOk", () => {
    modalComponent.props().onOk();
    expect(setModalVisible).toHaveBeenCalled();
  })

  test("modal onCancel", () => {
    modalComponent.props().onCancel();
    expect(setModalVisible).toHaveBeenCalled();
  })

  test("modalContainer handleModal (with User)", () => {
    modalContainer.simulate("click");
    expect(setModalVisible).toHaveBeenCalledWith(true);
  })
})