import "core-js/stable";
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
