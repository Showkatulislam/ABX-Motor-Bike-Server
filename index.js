const express=require("express")
const app=express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId=require('mongodb').ObjectId
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.xhxaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function  run(){
    try{
        await client.connect()
        const database=client.db('bikestore')
        const bikesCollection=database.collection('bikes')
        const userCollection=database.collection('users')
        const ordersCollection=database.collection('orders')
        const reviewCollection=database.collection('review')
        app.post('/addbikes',async(req,res)=>{
            const bike=req.body
            const result=await bikesCollection.insertOne(bike)
            res.json(result)
      
        })
        app.get('/bikes',async(req,res)=>{
            const cursor=bikesCollection.find({})
            const result=await cursor.toArray()
            res.json(result)
        })
        app.get('/bike/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result=await bikesCollection.findOne(query)
            res.json(result)
        })
        app.delete('/bike/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result=await bikesCollection.deleteOne(query)
            res.json(result)
        })

        ///post user order
        app.post('/orders',async(req,res)=>{
            const order=req.body
            result=await ordersCollection.insertOne(order)
            res.json(result)
           

        })
       app.get('/orders',async(req,res)=>{
           const orders=ordersCollection.find({})
           const result=await orders.toArray()
           res.json(result)
       })
       app.get('/orders/:email',async(req,res)=>{
           const email=req.params.email
           const query={email:email}
           const orders= ordersCollection.find(query)
           const result=await orders.toArray()
           res.json(result)
          

       })
       app.delete('/order/:id',async(req,res)=>{
           const id=req.params.id
           const query = { _id: ObjectId(id) };
           const result=await ordersCollection.deleteOne(query)
           res.json(result)
       })
       app.put('/order/:id',async(req,res)=>{
           const id=req.params.id
           const filter={ _id: ObjectId(id) };
           const updateDoc={$set:{status:'delivary'}}
           const result=await ordersCollection.updateOne(filter,updateDoc)
           res.json(result)

       })
       //users 
       app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })

    app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        console.log(result);
        res.json(result);
    });

    app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });
    app.put('/users/admin',async(req,res)=>{
        const user=req.body
        const filter={email:user.email}
        const updateDoc={$set:{role:'admin'}}
        const result=await userCollection.updateOne(filter,updateDoc)
        res.json(result)
    })
    //review route
    app.post('/reviews',async(req,res)=>{
        const review=req.body
        const result=await reviewCollection.insertOne(review)
        res.json(result)
    })

    app.get('/reviews',async(req,res)=>{
        const cursur=reviewCollection.find({})
        const result=await cursur.toArray()
        res.json(result)
    })
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir)
app.get('/',async(req,res)=>{
    res.send("hello")
})
app.listen(port,()=>{
    console.log("i am from ",port)
})