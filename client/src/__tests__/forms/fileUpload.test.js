import React from "react";
import Enzyme, { mount } from "enzyme";
import { Provider } from "react-redux";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
Enzyme.configure({ adapter: new Adapter() });
import { Badge } from "antd";

import { createStore } from "redux";
import moxios from "moxios";
import { waitFor } from "@testing-library/react";
import rootReducer from "../../reducers";
const store = createStore(rootReducer);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import FileUpload from "../../components/forms/FileUpload";

window.scrollTo = jest.fn();
const setValues = jest.fn();
const setLoading = jest.fn();
const values = {
  images: [
    {
      public_id: "3_hyflzl",
      url: "https://res.cloudinary.com/dtcgdx66j/image/upload/v1639163056/ecomm_seeds/Dell_G15/3_hyflzl.jpg",
    },
  ],
};

const mockImageBlob = (name, size, mimeType) => {
  name = name || "mock.txt";
  size = size || 1024;
  mimeType = mimeType || "image/png";

  function range(count) {
    var output = "";
    for (var i = 0; i < count; i++) {
      output += "a";
    }
    return output;
  }

  var blob = new Blob([range(size)], { type: mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = name;

  return blob;
};

const mockBlob = mockImageBlob();

moxios.install();

const wrapper = mount(
  <Provider store={store}>
    <FileUpload setValues={setValues} setLoading={setLoading} values={values} />
  </Provider>
);

describe("fileUpload form", () => {
  const fileInput = wrapper.find({ type: "file" });
  const badge = wrapper.find(Badge);

  test("fileUpload renders", async () => {
    await waitFor(() =>
      moxios.wait(function () {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            data: {},
          },
        });
      })
    );
    expect(fileInput.length).toBe(1);
    expect(badge.length).toBe(1);
  });

  test("badge click (remove image)", async () => {
    badge.simulate("click");
    await waitFor(() =>
      moxios.wait(function () {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {
            data: {},
          },
        });
      })
    );
    expect(setLoading).toHaveBeenCalledWith(true);
  });

  test("fileUpload onChange processes", () => {
    fileInput.simulate("change", { target: { files: [mockBlob] } });
    expect(setLoading).toHaveBeenCalledWith(true);
  });
});
