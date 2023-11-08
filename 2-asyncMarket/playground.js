'use strict';

((global) => {
  const addTimeout = (fn) => {
    return () => {
      setTimeout(() => {
        fn();
      }, 100 * Math.random());
    };
  };

  const addRandomError = (fn, result) => {
    return () => {
      const isError = Math.random() <= 0.2;

      if (isError) {
        fn(new Error('Something went wrong'), null);
      } else {
        fn(null, result);
      }
    };
  };

  const getModifiedCallback = (fn, result) => {
    return addTimeout(addRandomError(fn, result));
  };

  class Entity {
    constructor(name, isActive) {
      this.getName = (callback) => {
        getModifiedCallback(callback, name)();
      };

      this.checkIsActive = (callback) => {
        getModifiedCallback(callback, isActive)();
      };
    }
  }

  class Category extends Entity {
    constructor(name, status, children) {
      super(name, status);

      this.getChildren = (callback) => {
        getModifiedCallback(callback, children)();
      };
    }
  }

  class Product extends Entity {
    constructor(name, status, price) {
      super(name, status);

      this.getPrice = (callback) => {
        getModifiedCallback(callback, price)();
      };
    }
  }

  global.Product = Product;
  global.Category = Category;
})(typeof window === 'undefined' ? global : window);

// примеры вызова методов
// catalog.checkIsActive((error, isActive) => console.log({ error, isActive }));
// catalog.getName((error, name) => console.log({ error, name }));
// catalog.getChildren((error, children) => console.log({ error, children }));

async function solution({ minPrice, maxPrice, catalog }) {
  async function catalogOperation(catalog, operationName) {
    return new Promise((resolve, reject) => {
      function callbackActive(error, result) {
        if (result != null) {
          resolve(result);
        } else {
          catalog[operationName](callbackActive);
        }
      }
      catalog[operationName](callbackActive);
    });
  }

  const findProduct = async (catalog) => {
    const result = [];

    const isActive = await catalogOperation(catalog, 'checkIsActive');

    if (!isActive) return result;

    if (catalog instanceof Category) {
      const childrenAll = await catalogOperation(catalog, 'getChildren');
      function raceChildren(childrenAll) {
        return Promise.all(
          childrenAll.map((element) => findProduct(element))
        ).then((results) => {
          const filteredResults = results.filter(
            (childResult) => childResult.length > 0
          );
          const flattenedResults = filteredResults.reduce(
            (acc, curr) => acc.concat(curr),
            []
          );
          return flattenedResults;
        });
      }
      const res = await raceChildren(childrenAll);
      if (!!res) {
        result.push(...res);
      }
    } else {
      const priceProd = await catalogOperation(catalog, 'getPrice');
      const nameProd = await catalogOperation(catalog, 'getName');
      if (priceProd >= minPrice && priceProd <= maxPrice) {
        result.push({ name: nameProd, price: priceProd });
        //console.log({ name: nameProd, price: priceProd });
      }
    }

    return result;
  };
  function sortProduct(products) {
    products.sort((a, b) => {
      if (a.price === b.price) {
        return a.name.localeCompare(b.name);
      } else {
        return a.price - b.price;
      }
    });
    return products;
  }

  const result = await findProduct(catalog);
  const arrr = sortProduct(result);

  return arrr;
}

module.exports = solution;
// проверка решения
const input = {
  minPrice: 300,
  maxPrice: 1500,
  catalog: new Category('Catalog', true, [
    new Category('Electronics', true, [
      new Category('Smartphones', true, [
        new Product('Smartphone 1', true, 1000),
        new Product('Smartphone 2', true, 900),
        new Product('Smartphone 3', false, 900),
        new Product('Smartphone 4', true, 900),
        new Product('Smartphone 5', true, 900),
      ]),
      new Category('Laptops', true, [
        new Product('Laptop 1', false, 1200),
        new Product('Laptop 2', true, 900),
        new Product('Laptop 3', true, 1500),
        new Product('Laptop 4', true, 1600),
      ]),
    ]),
    new Category('Books', true, [
      new Category('Fiction', false, [
        new Product('Fiction book 1', true, 350),
        new Product('Fiction book 2', false, 400),
      ]),
      new Category('Non-Fiction', true, [
        new Product('Non-Fiction book 1', true, 250),
        new Product('Non-Fiction book 2', true, 300),
        new Product('Non-Fiction book 3', true, 400),
      ]),
    ]),
  ]),
};
const answer = [
  { name: 'Non-Fiction book 2', price: 300 },
  { name: 'Non-Fiction book 3', price: 400 },
  { name: 'Laptop 2', price: 900 },
  { name: 'Smartphone 2', price: 900 },
  { name: 'Smartphone 4', price: 900 },
  { name: 'Smartphone 5', price: 900 },
  { name: 'Smartphone 1', price: 1000 },
  { name: 'Laptop 3', price: 1500 },
];

solution(input).then((result) => {
  const isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(result);
  console.log(result);
  if (isAnswerCorrect) {
    console.log('OK');
  } else {
    console.log('WRONG');
  }
});
