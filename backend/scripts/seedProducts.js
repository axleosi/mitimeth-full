import axios from 'axios'


const products = [
    { name: "Product 1", description: "Description 1", price: 10.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 20 },
    { name: "Product 2", description: "Description 2", price: 20.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 15 },
    { name: "Product 3", description: "Description 3", price: 15.49, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 30 },
    { name: "Product 4", description: "Description 4", price: 5.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 50 },
    { name: "Product 5", description: "Description 5", price: 8.75, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 25 },
    { name: "Product 6", description: "Description 6", price: 12.00, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 10 },
    { name: "Product 7", description: "Description 7", price: 9.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 18 },
    { name: "Product 8", description: "Description 8", price: 17.50, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 12 },
    { name: "Product 9", description: "Description 9", price: 22.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 7 },
    { name: "Product 10", description: "Description 10", price: 19.95, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 14 },
    { name: "Product 11", description: "Description 11", price: 13.30, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 6 },
    { name: "Product 12", description: "Description 12", price: 16.00, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 28 },
    { name: "Product 13", description: "Description 13", price: 11.45, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 22 },
    { name: "Product 14", description: "Description 14", price: 6.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 33 },
    { name: "Product 15", description: "Description 15", price: 14.25, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 19 },
    { name: "Product 16", description: "Description 16", price: 24.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 8 },
    { name: "Product 17", description: "Description 17", price: 21.50, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 16 },
    { name: "Product 18", description: "Description 18", price: 18.75, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 11 },
    { name: "Product 19", description: "Description 19", price: 7.45, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 29 },
    { name: "Product 20", description: "Description 20", price: 23.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 4 },
    { name: "Product 21", description: "Description 21", price: 9.80, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 13 },
    { name: "Product 22", description: "Description 22", price: 8.40, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 21 },
    { name: "Product 23", description: "Description 23", price: 10.10, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 17 },
    { name: "Product 24", description: "Description 24", price: 12.99, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 35 },
    { name: "Product 25", description: "Description 25", price: 14.75, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 9 },
    { name: "Product 26", description: "Description 26", price: 20.00, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 40 },
    { name: "Product 27", description: "Description 27", price: 25.50, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 3 },
    { name: "Product 28", description: "Description 28", price: 19.00, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 5 },
    { name: "Product 29", description: "Description 29", price: 6.49, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 24 },
    { name: "Product 30", description: "Description 30", price: 17.25, imageUrl: "https://dimg04.c-ctrip.com/images/02Y5r120009zkfyt76298_R_1080_808_Q90.jpg", stock: 38 },
  ];

  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQ5N2FiNDk0OWFmMjYxYzBjYWZhMTkiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTY0NjAwNCwiZXhwIjoxNzQ5NjQ5NjA0fQ.KaJWgehZN3OhhGVrSvsrPrr9iEGvazFj3FUW-sJd_AY"
  
  async function seed() {
    for (const product of products) {
      try {
        const res = await axios.post('http://localhost:3000/api/product', product, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Created:', res.data.product.name);
      } catch (err) {
        console.error('Error:', err.response?.data || err.message);
      }
    }
  }
  
  seed();