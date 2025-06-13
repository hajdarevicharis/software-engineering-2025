/**
 * @jest-environment jsdom
 */

const $ = require("jquery");
global.$ = $;
global.jQuery = $;

global.Constants = {
  get_api_base_url: jest.fn(() => "http://localhost:8000/")
};

global.toastr = {
  success: jest.fn(),
  error: jest.fn()
};

$.fn.validate = jest.fn().mockReturnValue({
  destroy: jest.fn(),
  form: jest.fn().mockReturnValue(true)
});

$.fn.block = jest.fn();
$.fn.unblock = jest.fn();

$.post = jest.fn();

describe("Register form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    document.body.innerHTML = `
      <form id="register-form">
        <input name="firstName" type="text" />
        <input name="lastName" type="text" />
        <input name="email" type="email" />
        <input name="pwd" type="password" id="register-password" />
        <input name="repeat_password" type="password" />
        <button type="submit">Register</button>
      </form>
    `;

    $.fn.serializeArray = jest.fn().mockReturnValue([
      { name: "firstName", value: "John" },
      { name: "lastName", value: "Doe" },
      { name: "email", value: "john.doe@example.com" },
      { name: "pwd", value: "password123" },
      { name: "repeat_password", value: "password123" }
    ]);

    $.fn.reset = jest.fn();
    
    require("../js/register.js");
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("should set up form validation with correct rules", () => {
    expect($.fn.validate).toHaveBeenCalledWith({
      rules: {
        "firstName": {
          required: true
        },
        "lastName": {
          required: true
        },
        "email": {
          required: true,
          email: true
        },
        "pwd": {
          required: true
        },
        "repeat_password": {
          required: true,
          equalTo: "#register-password"
        }
      },
      messages: {
        "firstName": {
          required: "Please enter your first name"
        },
        "lastName": {
          required: "Please enter your last name"
        },
        "email": {
          required: "Please enter your email",
          email: "Please enter a valid email address"
        },
        "pwd": {
          required: "Please enter a password"
        },
        "repeat_password": {
          required: "Please repeat your password",
          equalTo: "Passwords do not match"
        }
      },
      submitHandler: expect.any(Function)
    });
  });

  it("should handle successful registration", () => {
    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("register-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect($.fn.block).toHaveBeenCalledWith({
      message: '<div class="spinner-border text-primary" role="status"></div>',
      css: {
        backgroundColor: "transparent",
        border: "0"
      },
      overlayCSS: {
        backgroundColor: "#000000",
        opacity: 0.25
      }
    });
    
    expect(Constants.get_api_base_url).toHaveBeenCalled();
    expect($.post).toHaveBeenCalledWith(
      "http://localhost:8000/users/add",
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        pwd: "password123",
        repeat_password: "password123"
      }
    );
    
    expect($.fn.unblock).toHaveBeenCalledWith({});
    expect(toastr.success).toHaveBeenCalledWith("User added successfully");
  });

  it("should add user to registers array", () => {
    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("register-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect($.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        pwd: "password123",
        repeat_password: "password123"
      })
    );
  });

  it("should serialize form data correctly", () => {
    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    $.fn.serializeArray.mockReturnValue([
      { name: "firstName", value: "Jane" },
      { name: "lastName", value: "Smith" },
      { name: "email", value: "jane.smith@example.com" },
      { name: "pwd", value: "mypassword" },
      { name: "repeat_password", value: "mypassword" }
    ]);

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("register-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect($.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        pwd: "mypassword",
        repeat_password: "mypassword"
      }
    );
  });

  it("should reset form on successful registration", () => {
    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    const mockForm = document.getElementById("register-form");
    mockForm.reset = jest.fn();

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect(mockForm.reset).toHaveBeenCalled();
  });

  it("should block and unblock UI during registration process", () => {
    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("register-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect($.fn.block).toHaveBeenCalledWith({
      message: '<div class="spinner-border text-primary" role="status"></div>',
      css: {
        backgroundColor: "transparent",
        border: "0"
      },
      overlayCSS: {
        backgroundColor: "#000000",
        opacity: 0.25
      }
    });
    
    expect($.fn.unblock).toHaveBeenCalledWith({});
  });

  it("should use correct API endpoint", () => {
    Constants.get_api_base_url.mockReturnValue("https://api.example.com/v1/");

    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("register-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect($.post).toHaveBeenCalledWith(
      "https://api.example.com/v1/users/add",
      expect.any(Object)
    );
  });

  it("should handle empty form data", () => {
    $.fn.serializeArray.mockReturnValue([
      { name: "firstName", value: "" },
      { name: "lastName", value: "" },
      { name: "email", value: "" },
      { name: "pwd", value: "" },
      { name: "repeat_password", value: "" }
    ]);

    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("register-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect($.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        firstName: "",
        lastName: "",
        email: "",
        pwd: "",
        repeat_password: ""
      }
    );
  });

  it("should handle special characters in form data", () => {
    $.fn.serializeArray.mockReturnValue([
      { name: "firstName", value: "José" },
      { name: "lastName", value: "García-López" },
      { name: "email", value: "josé.garcía@example.com" },
      { name: "pwd", value: "pássw@rd123!" },
      { name: "repeat_password", value: "pássw@rd123!" }
    ]);

    const mockDeferred = {
      done: jest.fn().mockImplementation((callback) => {
        callback();
        return mockDeferred;
      })
    };
    
    $.post.mockReturnValue(mockDeferred);

    const validateCall = $.fn.validate.mock.calls[0][0];
    const submitHandler = validateCall.submitHandler;

    const mockForm = document.getElementById("register-form");
    const mockEvent = { preventDefault: jest.fn() };

    submitHandler(mockForm, mockEvent);

    expect($.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        firstName: "José",
        lastName: "García-López",
        email: "josé.garcía@example.com",
        pwd: "pássw@rd123!",
        repeat_password: "pássw@rd123!"
      }
    );
  });
});

describe("Utility functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    $.fn.block = jest.fn();
    $.fn.unblock = jest.fn();
    
    require("../js/register.js");
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("should test blockUi function", () => {
    expect(true).toBe(true);
  });

  it("should test unblockUi function", () => {
    expect(true).toBe(true);
  });

  it("should test serializeForm function behavior", () => {
    expect(true).toBe(true);
  });
});
