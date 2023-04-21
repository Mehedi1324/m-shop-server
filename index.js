const express = require('express');
const app = express();
const port = process.env.PORT || 1010;
const cors = require('cors');
require('dotenv').config();

// middleware___
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from rode js');
});

const {
  MongoClient,
  ObjectId,
  CURSOR_FLAGS,
  ClientSession,
} = require('mongodb');
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('products');
    const latestCollections = database.collection('latest_collections');
    const mostSellingCollections = database.collection('most_sellings');
    const topSellingCollections = database.collection('top_selling');
    const topTrendingCollections = database.collection('top_trending');
    const buyerInfo = database.collection('buyer_info');

    // Getting latest_collections from mongodb
    app.get('/latest_collections', async (req, res) => {
      const cursor = latestCollections.find({});
      const products = await cursor.toArray();
      console.log(products);
      res.send(products);
    });

    // Finding Products From Collection of data_________________

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const productCol =
        (await latestCollections.findOne(query)) ||
        mostSellingCollections.findOne(query) ||
        topSellingCollections.findOne(query) ||
        topTrendingCollections.findOne(query);
      console.log(productCol);
      res.send(productCol);
    });

    // Getting most_sellings from mongodb

    app.get('/most_selling', async (req, res) => {
      const cursor = mostSellingCollections.find({});
      const products = await cursor.toArray();

      res.send(products);
    });

    // Getting top_selling from mongodb
    app.get('/top_selling', async (req, res) => {
      const cursor = topSellingCollections.find({});
      const products = await cursor.toArray();

      res.send(products);
    });

    // Getting top_trending from mongodb
    app.get('/trending', async (req, res) => {
      const cursor = topTrendingCollections.find({});
      const products = await cursor.toArray();

      res.send(products);
    });

    // Posting buyer Information________________

    app.post('/buyerInfo', async (req, res) => {
      const data = req.body;
      const result = await buyerInfo.insertMany(data);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('listening to the port', port);
});
