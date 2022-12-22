const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2sjsg0j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });

async function run() {
  try {
    await client.connect();
    console.log("db-connect");

    const BlogCollection = client.db('Techblog').collection("blog");

    app.post("/blog", async (req, res) => {
      const data = req.body;
      console.log(data);
      const blog = await BlogCollection.insertOne(data);
      res.send(blog);
    });
    app.get("/blog", async (req, res) => {
      const result = await BlogCollection.find({}).toArray();
      res.send(result);
    });
    app.delete("/blog/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await BlogCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.patch("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: req.body,
      };
      const result = await BlogCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });


  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Blog server running")
})

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
