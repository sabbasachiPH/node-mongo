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

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const name = users[id];
  console.log({ id, name });
  res.send({ id, name });
});
//GET
app.get("/products", (req, res) => {
  let client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection
      .find()
      .limit(5)
      .toArray((err, documents) => {
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
app.post("/addProduct", (req, res) => {
  const product = req.body;
  let client = new MongoClient(uri, { useNewUrlParser: true });
  console.log(product);
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.insertOne(product, (err, result) => {
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
