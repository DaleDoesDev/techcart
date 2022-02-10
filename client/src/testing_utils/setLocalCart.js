export const setLocalCart = () => window.localStorage.setItem("cart", JSON.stringify(
  [
     {
        "subs": [
           {
              "_id": "61be6cf697a7300771a1579c",
              "name": "Macbook Air",
              "parent": "61be6cf697a7300771a15797",
              "slug": "macbook-air",
              "createdAt": "2021-12-18T23:21:26.418Z",
              "updatedAt": "2021-12-18T23:21:26.418Z",
              "__v": 0
           }
        ],
        "sold": 63,
        "images": [
        ],
        "colors": [
           "Silver",
           "Gold",
           "Gray"
        ],
        "_id": "61be6cf797a7300771a157dc",
        "brand": {
           "_id": "61be6cf697a7300771a157a5",
           "name": "Apple",
           "slug": "apple",
           "createdAt": "2021-12-18T23:21:26.419Z",
           "updatedAt": "2021-12-18T23:21:26.419Z",
           "__v": 0
        },
        "category": {
           "_id": "61be6cf697a7300771a15797",
           "name": "macOS",
           "slug": "macos",
           "createdAt": "2021-12-18T23:21:26.318Z",
           "updatedAt": "2021-12-18T23:21:26.318Z",
           "__v": 0
        },
        "description": "test",
        "price": 899.99,
        "quantity": 100,
        "ratings": [
        ],
        "slug": "apple-m1-8gb-macbook-air",
        "title": "Apple M1 8GB MacBook Air",
        "createdAt": "2021-12-18T23:21:27.253Z",
        "updatedAt": "2021-12-28T01:18:31.706Z",
        "__v": 0,
        "count": 1,
        "selectedColor": "Silver"
     }
  ]
));