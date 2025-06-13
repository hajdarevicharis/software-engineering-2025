/**
 * @jest-environment jsdom
 */

const $ = require("jquery");
global.$ = $;
global.jQuery = $;


global.Utils = {
  block_ui: jest.fn(),
  unblock_ui: jest.fn(),
  get_from_localstorage: jest.fn(() => null),
  set_to_localstorage: jest.fn()
};

global.RestClient = {
  post: jest.fn()
};

global.toastr = {
  error: jest.fn()
};

delete window.location;
window.location = { href: "" };

$.fn.validate = jest.fn().mockReturnValue({
  destroy: jest.fn(),
  form: jest.fn().mockReturnValue(true)
});

describe("Login form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    Utils.get_from_localstorage.mockReturnValue(null);
    
    document.body.innerHTML = `
      <form id="login-form">
        <input name="login-email" type="email" />
        <input name="login-password" type="password" />
        <button type="submit">Login</button>
      </form>
    `;

    $.fn.serializeArray = jest.fn().mockReturnValue([
      { name: "login-email", value: "test@example.com" },
      { name: "login-password", value: "secret123" }
    ]);

    $.fn.reset = jest.fn();
    
    require("../js/login.js");
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("should redirect to index.html if user is already logged in", () => {
    Utils.get_from_localstorage.mockReturnValue({ id: 1, email: "test@example.com" });
    
    jest.resetModules();
    require("../js/login.js");
    
    expect(window.location).toBe("../index.html");
  });

  it("should set up form validation with correct rules", () => {
    expect($.fn.validate).toHaveBeenCalledWith({
      rules: {
        "login-email": {
          required: true,
          email: true
        },
        "login-password": {
          required: true
        }
      },
      messages: {
        "login-email": {
          required: "Please enter your email",
          email: "Please enter a correct email"
        },
        "login-password": {
          required: "Please enter a password"
        }
      },
      submitHandler: expect.any(Function)
    });
  });

  it("should handle successful login", () => {
    const mockResponse = {
      id: 1,
      email: "test@example.com",
      firstName: "John",
      token: "jwt-token-123"
    };

    RestClient.post.mockImplementation((url, data, successCallback) => {
      successCallback(mockResponse);
    });

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("login-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(Utils.block_ui).toHaveBeenCalledWith("body");
    expect(RestClient.post).toHaveBeenCalledWith(
      "auth/login",
      { "login-email": "test@example.com", "login-password": "secret123" },
      expect.any(Function),
      expect.any(Function)
    );
    expect(Utils.unblock_ui).toHaveBeenCalledWith("body");
    expect(Utils.set_to_localstorage).toHaveBeenCalledWith("user", mockResponse);
    expect(window.location).toBe("../index.html");
  });

  it("should handle login error", () => {
    const mockError = {
      responseText: "Invalid email or password"
    };

    RestClient.post.mockImplementation((url, data, successCallback, errorCallback) => {
      errorCallback(mockError);
    });

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("login-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(Utils.block_ui).toHaveBeenCalledWith("body");
    expect(RestClient.post).toHaveBeenCalled();
    expect(Utils.unblock_ui).toHaveBeenCalledWith("body");
    expect(toastr.error).toHaveBeenCalledWith("Invalid email or password");
    expect(Utils.set_to_localstorage).not.toHaveBeenCalled();
  });

  it("should serialize form data correctly", () => {
    const mockResponse = { id: 1, token: "abc123" };
    
    RestClient.post.mockImplementation((url, data, successCallback) => {
      expect(data).toEqual({
        "login-email": "test@example.com",
        "login-password": "secret123"
      });
      successCallback(mockResponse);
    });

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("login-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect(RestClient.post).toHaveBeenCalled();
  });

  it("should reset form on successful login", () => {
    const mockResponse = { id: 1, token: "abc123" };
    
    RestClient.post.mockImplementation((url, data, successCallback) => {
      successCallback(mockResponse);
    });

    const mockForm = document.getElementById("login-form");
    mockForm.reset = jest.fn();

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect(mockForm.reset).toHaveBeenCalled();
  });

  it("should block and unblock UI during login process", () => {
    const mockResponse = { id: 1, token: "abc123" };
    
    RestClient.post.mockImplementation((url, data, successCallback) => {
      successCallback(mockResponse);
    });

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("login-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect(Utils.block_ui).toHaveBeenCalledWith("body");
    expect(Utils.unblock_ui).toHaveBeenCalledWith("body");
  });
});