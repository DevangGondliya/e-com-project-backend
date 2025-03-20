const { Product } = require("./models/Product");
// const axios = require("axios");
// const createProduct = async () => {
//   try {
//     const response = await fetch("http://localhost:8080/category");
//     const data = await response.json();

//     for (let pro in data) {
//       console.log(pro);
//       let doc = new Product(pro);
//       let product = await doc.save();
//       console.log(product);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
// createProduct();

const axios = require("axios");
const mongoose = require("mongoose");
const { Brand } = require("./models/Brand");
const { Category } = require("./models/Category");
const DBURL = process.env.DBURL || "mongodb://127.0.0.1/eKart";

//connecting mongodb to backend
mongoose.connect(DBURL, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Adjust the timeout value
});

async function getApi() {
  try {
    const result = await axios.get("http://localhost:8000/category");
    const products1 = result.data;

    // Assume you have a category named "smartphones" in the database
    // Save each product to the database
    for (const productData of products1) {
      const product = new Category(productData);
      await product.save();
    }
    console.log("Products saved to the database");
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }
}

// Call the function
getApi();
