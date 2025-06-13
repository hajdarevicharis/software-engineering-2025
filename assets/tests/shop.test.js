/**
 * @jest-environment jsdom
 */

const $ = require("jquery");
global.$ = $;
global.jQuery = $;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
global.localStorage = localStorageMock;

$.get = jest.fn();
$.fn.empty = jest.fn();
$.fn.append = jest.fn();
$.fn.val = jest.fn();
$.fn.change = jest.fn();
$.fn.click = jest.fn();
$.fn.block = jest.fn();
$.fn.unblock = jest.fn();

describe("Shop functionality", () => {
  let mockProductData;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockProductData = [
      {
        id: 1,
        name: "Cool Sunglasses",
        category: "sunglasses",
        image: "sunglasses1.jpg",
        price: 99.99,
        rating: 4
      },
      {
        id: 2,
        name: "Reading Glasses",
        category: "glasses",
        image: "glasses1.jpg",
        price: 49.99,
        rating: 5
      },
      {
        id: 3,
        name: "Fashion Sunglasses",
        category: "sunglasses",
        image: "sunglasses2.jpg",
        price: 79.99,
        rating: 3
      }
    ];

    document.body.innerHTML = `
      <div class="shop-body_sunglasses"></div>
      <div class="shop-body_glasses"></div>
      <select id="item-type">
        <option value="Sunglasses">Sunglasses</option>
        <option value="Glasses">Glasses</option>
      </select>
      <select id="sort-type">
        <option value="Featured">Featured</option>
        <option value="Most popular">Most popular</option>
        <option value="Alphabetical">Alphabetical</option>
      </select>
      <input id="search-input" type="text" />
      <button id="search-btn">Search</button>
    `;

    require("../js/shop.js");
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe("getShopItems", () => {
    it("should fetch data and call renderItems on success", () => {
      const mockRenderItems = jest.fn();
      global.renderItems = mockRenderItems;
      
      $.get.mockImplementation((url, callback) => {
        callback(mockProductData);
        return { fail: jest.fn() };
      });

      const getShopItems = (dataUrl) => {
        $.get(dataUrl, (data) => {
          let itemsArray;
          
          if (Array.isArray(data)) {
            itemsArray = data;
          } else if (data.products && Array.isArray(data.products)) {
            itemsArray = data.products;
          } else if (data.data && Array.isArray(data.data)) {
            itemsArray = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            itemsArray = data.items;
          } else {
            console.error("Could not find array in response:", data);
            return;
          }
          
          global.fetchedData = [];
          itemsArray.forEach(instance => {
            global.fetchedData.push(instance);
          });
          
          global.renderItems(global.fetchedData);
        });
      };

      getShopItems("./assets/json/products.json");

      expect($.get).toHaveBeenCalledWith(
        "./assets/json/products.json",
        expect.any(Function)
      );
      expect(global.fetchedData).toEqual(mockProductData);
      expect(mockRenderItems).toHaveBeenCalledWith(mockProductData);
    });

    it("should handle data wrapped in products property", () => {
      const wrappedData = { products: mockProductData };
      const mockRenderItems = jest.fn();
      global.renderItems = mockRenderItems;
      
      $.get.mockImplementation((url, callback) => {
        callback(wrappedData);
        return { fail: jest.fn() };
      });

      const getShopItems = (dataUrl) => {
        $.get(dataUrl, (data) => {
          let itemsArray;
          
          if (Array.isArray(data)) {
            itemsArray = data;
          } else if (data.products && Array.isArray(data.products)) {
            itemsArray = data.products;
          } else if (data.data && Array.isArray(data.data)) {
            itemsArray = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            itemsArray = data.items;
          } else {
            console.error("Could not find array in response:", data);
            return;
          }
          
          global.fetchedData = [];
          itemsArray.forEach(instance => {
            global.fetchedData.push(instance);
          });
          
          global.renderItems(global.fetchedData);
        });
      };

      getShopItems("./assets/json/products.json");

      expect(global.fetchedData).toEqual(mockProductData);
      expect(mockRenderItems).toHaveBeenCalledWith(mockProductData);
    });

    it("should handle data wrapped in data property", () => {
      const wrappedData = { data: mockProductData };
      const mockRenderItems = jest.fn();
      global.renderItems = mockRenderItems;
      
      $.get.mockImplementation((url, callback) => {
        callback(wrappedData);
        return { fail: jest.fn() };
      });

      const getShopItems = (dataUrl) => {
        $.get(dataUrl, (data) => {
          let itemsArray;
          
          if (Array.isArray(data)) {
            itemsArray = data;
          } else if (data.products && Array.isArray(data.products)) {
            itemsArray = data.products;
          } else if (data.data && Array.isArray(data.data)) {
            itemsArray = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            itemsArray = data.items;
          } else {
            console.error("Could not find array in response:", data);
            return;
          }
          
          global.fetchedData = [];
          itemsArray.forEach(instance => {
            global.fetchedData.push(instance);
          });
          
          global.renderItems(global.fetchedData);
        });
      };

      getShopItems("./assets/json/products.json");

      expect(global.fetchedData).toEqual(mockProductData);
      expect(mockRenderItems).toHaveBeenCalledWith(mockProductData);
    });

    it("should handle data wrapped in items property", () => {
      const wrappedData = { items: mockProductData };
      const mockRenderItems = jest.fn();
      global.renderItems = mockRenderItems;
      
      $.get.mockImplementation((url, callback) => {
        callback(wrappedData);
        return { fail: jest.fn() };
      });

      const getShopItems = (dataUrl) => {
        $.get(dataUrl, (data) => {
          let itemsArray;
          
          if (Array.isArray(data)) {
            itemsArray = data;
          } else if (data.products && Array.isArray(data.products)) {
            itemsArray = data.products;
          } else if (data.data && Array.isArray(data.data)) {
            itemsArray = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            itemsArray = data.items;
          } else {
            console.error("Could not find array in response:", data);
            return;
          }
          
          global.fetchedData = [];
          itemsArray.forEach(instance => {
            global.fetchedData.push(instance);
          });
          
          global.renderItems(global.fetchedData);
        });
      };

      getShopItems("./assets/json/products.json");

      expect(global.fetchedData).toEqual(mockProductData);
      expect(mockRenderItems).toHaveBeenCalledWith(mockProductData);
    });

    it("should handle error when no array found in response", () => {
      const invalidData = { invalid: "data" };
      console.error = jest.fn();
      
      $.get.mockImplementation((url, callback) => {
        callback(invalidData);
        return { fail: jest.fn() };
      });

      const getShopItems = (dataUrl) => {
        $.get(dataUrl, (data) => {
          let itemsArray;
          
          if (Array.isArray(data)) {
            itemsArray = data;
          } else if (data.products && Array.isArray(data.products)) {
            itemsArray = data.products;
          } else if (data.data && Array.isArray(data.data)) {
            itemsArray = data.data;
          } else if (data.items && Array.isArray(data.items)) {
            itemsArray = data.items;
          } else {
            console.error("Could not find array in response:", data);
            return;
          }
        });
      };

      getShopItems("./assets/json/products.json");

      expect(console.error).toHaveBeenCalledWith(
        "Could not find array in response:",
        invalidData
      );
    });

    it("should handle fetch error", () => {
      const mockFail = jest.fn();
      console.error = jest.fn();
      
      $.get.mockImplementation(() => {
        return { fail: mockFail };
      });

      const getShopItems = (dataUrl) => {
        $.get(dataUrl).fail(function(jqXHR, textStatus, errorThrown) {
          console.error("Error fetching data:", textStatus, errorThrown);
        });
      };

      getShopItems("./assets/json/products.json");

      expect(mockFail).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("storeId", () => {
    it("should store product ID in localStorage", () => {
      const storeId = (id) => {
        localStorage.setItem("product-id", id);
      };
      
      storeId(123);
      
      expect(localStorage.setItem).toHaveBeenCalledWith("product-id", 123);
    });
  });

  describe("renderItems", () => {
    beforeEach(() => {
      $.fn.val.mockReturnValue("Sunglasses");
      
      global.generateStarIcons = (rating) => {
        let starIcons = '';
        for (let i = 0; i < 5; i++) {
          if (i < rating) {
            starIcons += '<li><i class="text-warning fa fa-star"></i></li>';
          } else {
            starIcons += '<li><i class="text-muted fa fa-star"></i></li>';
          }
        }
        return starIcons;
      };
    });

    it("should empty containers before rendering", () => {
      const renderItems = (itemsArray) => {
        $(".shop-body_sunglasses").empty();
        $(".shop-body_glasses").empty();
      };
      
      renderItems(mockProductData);

      expect($.fn.empty).toHaveBeenCalledTimes(2);
    });

    it("should render sunglasses when Sunglasses is selected", () => {
      $.fn.val.mockReturnValue("Sunglasses");
      const mockAppend = jest.fn();
      document.querySelector(".shop-body_sunglasses").append = mockAppend;

      const renderItems = (itemsArray) => {
        $(".shop-body_sunglasses").empty();
        $(".shop-body_glasses").empty();

        const shopBodySunglasses = document.querySelector(".shop-body_sunglasses");
        const shopBodyGlasses = document.querySelector(".shop-body_glasses");

        itemsArray.forEach(instance => {
          const item = document.createElement("div");
          item.classList.add("col-md-4");
          
          let selectedType = $("#item-type").val();

          if (instance.category === "sunglasses" && selectedType === "Sunglasses") {
            shopBodySunglasses.append(item);
          } else if (instance.category === "glasses" && selectedType === "Glasses") {
            shopBodyGlasses.append(item);
          }
        });
      };

      renderItems(mockProductData);

      expect(mockAppend).toHaveBeenCalledTimes(2); 
    });

    it("should render glasses when Glasses is selected", () => {
      $.fn.val.mockReturnValue("Glasses");
      const mockAppend = jest.fn();
      document.querySelector(".shop-body_glasses").append = mockAppend;

      const renderItems = (itemsArray) => {
        $(".shop-body_sunglasses").empty();
        $(".shop-body_glasses").empty();

        const shopBodySunglasses = document.querySelector(".shop-body_sunglasses");
        const shopBodyGlasses = document.querySelector(".shop-body_glasses");

        itemsArray.forEach(instance => {
          const item = document.createElement("div");
          item.classList.add("col-md-4");
          
          let selectedType = $("#item-type").val();

          if (instance.category === "sunglasses" && selectedType === "Sunglasses") {
            shopBodySunglasses.append(item);
          } else if (instance.category === "glasses" && selectedType === "Glasses") {
            shopBodyGlasses.append(item);
          }
        });
      };

      renderItems(mockProductData);

      expect(mockAppend).toHaveBeenCalledTimes(1); 
    });

    it("should generate star icons for each item", () => {
      global.generateStarIcons = jest.fn().mockReturnValue("★★★★☆");
      
      const renderItems = (itemsArray) => {
        itemsArray.forEach(instance => {
          global.generateStarIcons(instance.rating);
        });
      };

      renderItems(mockProductData);

      expect(global.generateStarIcons).toHaveBeenCalledWith(4);
      expect(global.generateStarIcons).toHaveBeenCalledWith(5);
      expect(global.generateStarIcons).toHaveBeenCalledWith(3);
    });
  });

  describe("generateStarIcons", () => {
    it("should generate correct star icons for rating 4", () => {
      const result = global.generateStarIcons(4);
      
      expect(result).toContain('<i class="text-warning fa fa-star"></i>');
      expect(result).toContain('<i class="text-muted fa fa-star"></i>');
      
      const filledStars = (result.match(/text-warning/g) || []).length;
      const emptyStars = (result.match(/text-muted/g) || []).length;
      
      expect(filledStars).toBe(4);
      expect(emptyStars).toBe(1);
    });

    it("should generate correct star icons for rating 5", () => {
      const result = global.generateStarIcons(5);
      
      const filledStars = (result.match(/text-warning/g) || []).length;
      const emptyStars = (result.match(/text-muted/g) || []).length;
      
      expect(filledStars).toBe(5);
      expect(emptyStars).toBe(0);
    });

    it("should generate correct star icons for rating 0", () => {
      const result = global.generateStarIcons(0);
      
      const filledStars = (result.match(/text-warning/g) || []).length;
      const emptyStars = (result.match(/text-muted/g) || []).length;
      
      expect(filledStars).toBe(0);
      expect(emptyStars).toBe(5);
    });
  });

  describe("Sorting functionality", () => {
    beforeEach(() => {
      global.fetchedData = [...mockProductData];
      global.renderItems = jest.fn();
    });

    it("should sort items by rating (most popular)", () => {
      const sortItemsByRating = () => {
        global.fetchedData.sort((a, b) => b.rating - a.rating);
      };
      
      sortItemsByRating();
      
      expect(global.fetchedData[0].rating).toBe(5);
      expect(global.fetchedData[1].rating).toBe(4);
      expect(global.fetchedData[2].rating).toBe(3);
    });

    it("should sort items by ID (featured)", () => {
      global.fetchedData = global.fetchedData.reverse();
      
      const sortItemsById = () => {
        global.fetchedData.sort((a, b) => a.id - b.id);
      };
      
      sortItemsById();
      
      expect(global.fetchedData[0].id).toBe(1);
      expect(global.fetchedData[1].id).toBe(2);
      expect(global.fetchedData[2].id).toBe(3);
    });

    it("should sort items alphabetically", () => {
      const sortItemsAlphabetically = () => {
        global.fetchedData.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      };
      
      sortItemsAlphabetically();
      
      expect(global.fetchedData[0].name).toBe("Cool Sunglasses");
      expect(global.fetchedData[1].name).toBe("Fashion Sunglasses");
      expect(global.fetchedData[2].name).toBe("Reading Glasses");
    });

    it("should handle sort type change event", () => {
      $.fn.val.mockReturnValue("Most popular");
      
      const sortItemsByRating = jest.fn(() => {
        global.fetchedData.sort((a, b) => b.rating - a.rating);
      });
      
      const handleSortChange = () => {
        let sortType = $("#sort-type").val();
        if (sortType === "Most popular") {
          sortItemsByRating();
          global.renderItems(global.fetchedData);
        }
      };

      handleSortChange();
      
      expect(sortItemsByRating).toHaveBeenCalled();
      expect(global.renderItems).toHaveBeenCalledWith(global.fetchedData);
    });
  });

  describe("Search functionality", () => {
    beforeEach(() => {
      global.fetchedData = [...mockProductData];
      global.renderItems = jest.fn();
      console.log = jest.fn();
    });

    it("should filter items based on search term", () => {
      $.fn.val.mockReturnValue("cool");
      
      const searchHandler = () => {
        let searchTerm = $("#search-input").val().trim().toLowerCase();
        if (searchTerm !== "") {
          const filteredData = global.fetchedData.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
          );
          global.renderItems(filteredData);
        } else {
          global.renderItems(global.fetchedData);
        }
      };
      
      searchHandler();
      
      expect(global.renderItems).toHaveBeenCalledWith([
        {
          id: 1,
          name: "Cool Sunglasses",
          category: "sunglasses",
          image: "sunglasses1.jpg",
          price: 99.99,
          rating: 4
        }
      ]);
    });

    it("should render all items when search term is empty", () => {
      $.fn.val.mockReturnValue("");
      
      const searchHandler = () => {
        let searchTerm = $("#search-input").val().trim().toLowerCase();
        if (searchTerm !== "") {
          const filteredData = global.fetchedData.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
          );
          global.renderItems(filteredData);
        } else {
          global.renderItems(global.fetchedData);
        }
      };
      
      searchHandler();
      
      expect(global.renderItems).toHaveBeenCalledWith(global.fetchedData);
    });

    it("should return empty array when no items match search", () => {
      $.fn.val.mockReturnValue("nonexistent");
      
      const searchHandler = () => {
        let searchTerm = $("#search-input").val().trim().toLowerCase();
        if (searchTerm !== "") {
          const filteredData = global.fetchedData.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
          );
          global.renderItems(filteredData);
        } else {
          global.renderItems(global.fetchedData);
        }
      };
      
      searchHandler();
      
      expect(global.renderItems).toHaveBeenCalledWith([]);
    });
  });

  describe("UI blocking functionality", () => {
    it("should block UI element", () => {
      global.blockUi("main");
      
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
    });

    it("should unblock UI element", () => {
      global.unblockUi("main");
      
      expect($.fn.unblock).toHaveBeenCalledWith({});
    });
  });

  describe("Item type change functionality", () => {
    it("should handle item type change event", () => {
      global.fetchedData = [...mockProductData];
      global.renderItems = jest.fn();
      global.blockUi = jest.fn();
      global.unblockUi = jest.fn();

      const changeHandler = () => {
        global.blockUi("main");
        global.renderItems(global.fetchedData);
        global.unblockUi("main");
      };

      changeHandler();

      expect(global.blockUi).toHaveBeenCalledWith("main");
      expect(global.renderItems).toHaveBeenCalledWith(global.fetchedData);
      expect(global.unblockUi).toHaveBeenCalledWith("main");
    });
  });
});