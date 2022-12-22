require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q66zrl2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



async function run() {
  try {
    await client.connect();
    console.log("db-connect");

    // const productCollection = client.db("blog_tech").collection("product");
    const BlogCollection = client.db("blog_tech").collection("blog");

    app.post("/blog", async (req, res) => {
      const data = req.body;
      console.log(data);
      const product = await BlogCollection.insertOne(data);
      res.send(product);
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

    app.get('/', (req, res) => {
      res.send("server running")
    })
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});



// const run = async () => {
//   try {
//     const db = client.db("blog_tech");
//     const blogCollection = db.collection("blog");

//     app.get("/blog", async (req, res) => {
//       const cursor = blogCollection.find({});
//       const blog = await cursor.toArray();

//       res.send({ status: true, data: blog });
//     });

//     app.post("/blog", async (req, res) => {
//       const data = req.body;

//       const result = await blogCollection.insertOne(data);

//       res.send(result);
//     });

//     app.delete("/blog/:id", async (req, res) => {
//       const id = req.params.id;

//       const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
//       res.send(result);
//     });

//     app.patch("/blog/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: ObjectId(id) };
//       const updatedDoc = {
//         $set: req.body,
//       };
//       const result = await BlogCollection.updateOne(filter, updatedDoc);
//       res.send(result);
//     });

//   } finally {
//   }
// };

// run().catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.send("Blog Server Run");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
