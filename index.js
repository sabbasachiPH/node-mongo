const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

// atlas DB Connection

//GET all
app.get("/products", (req, res) => {
  let client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    //console.log("Database Connected .....");
    client.close();
  });
});

//GET single

app.get("/product/:key", (req, res) => {
  const key = req.params.key;
  let client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find({ key }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents[0]);
      }
    });
    //console.log("Database Connected .....");
    client.close();
  });
});

app.post("/getProductsByKey", (req, res) => {
  const key = req.params.key;
  const productKeys = req.body;
  console.log(productKeys);
  let client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find({ key: { $in: productKeys } }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    //console.log("Database Connected .....");
    client.close();
  });
});
//post
app.post("/placeOrder", (req, res) => {
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  let client = new MongoClient(uri, { useNewUrlParser: true });
  console.log(orderDetails);
  client.connect(err => {
    const collection = client.db("onlineStore").collection("orders");
    // perform actions on the collection object
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    //console.log("Database Connected .....");
    client.close();
  });
  //console.log("data received ", req.body);
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log("Listenting from port 4200"));
