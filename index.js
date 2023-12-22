const express = require('express');
const app = express();
const cors =require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000


// middleware
app.use(cors());
app.use(express.json())
// mongodb start

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdlhstb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
// create collection
const addtask =client.db('FirstJobTaskDb').collection('addtask');
// add task related 
app.get('/addtask',async(req,res)=>{
  const result =await addtask.find().toArray();
  res.send(result)
})
app.post('/addtask', async(req,res)=>{
  const task =req.body;
  console.log(task);
  const result = await addtask.insertOne(task)
  res.send(result);
})
// get userbased task
app.get('/addtask/:email',async(req,res)=>{
  const email = req.params.email;
  const query ={email:email}
  const user = addtask.find(query);
  const result = await user.toArray() 
  res.send(result)
})
// deleted task
app.delete('/addtask/:id', async (req, res)=>{
  const id =req.params.id;
  const query ={ _id: new ObjectId(id) }
  const result = await addtask.deleteOne(query);
  res.send(result);
})




    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb start

app.get('/',(req,res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})