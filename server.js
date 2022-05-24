const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbiyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        const inventoryCollection = client.db('sareen').collection('inventory');
        console.log('db connected');
        //SERVICES API
        app.get('/services', async (req, res) => {
            const cursor = inventoryCollection.find()
            const services = await cursor.toArray();
            res.send(services)
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From  own portal!')
})

app.listen(port, () => {
    console.log(` App listening on port ${port}`)
})