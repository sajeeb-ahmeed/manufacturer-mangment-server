const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized Access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access" });
        }
        console.log("decoded", decoded);
        req.decoded = decoded;
        next();
    });
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbiyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("toolsDB");
        const toolsCollection = db.collection("toolsCollection");

        // API to Run Server
        app.get("/", async (req, res) => {
            res.send("Manufacturer Server Running");
        });

        //API to get all tools
        app.get("/tools", async (req, res) => {
            const tools = await toolsCollection.find({}).toArray();
            res.send(tools);
        });

        //API to get single tools
        app.get("/tools/:id", async (req, res) => {
            const id = req.params.id;
            const tool = await toolsCollection.findOne({ _id: ObjectId(id) });
            res.send(tool);
        });

        ////API to get all orders
        app.get("/orders", async (req, res) => {
            const orders = await ordersCollection.find({}).toArray();
            res.send(orders);
        });

        //API to update a order
        app.put("/orders/:id", async (req, res) => {
            const orderId = req.params.id;
            const order = req.body;
            console.log("order", order);
            const query = { _id: ObjectId(orderId) };
            const options = { upsert: true };
            const updatedOrder = await ordersCollection.updateOne(
                query,
                {
                    $set: order,
                },
                options
            );
            res.send(updatedOrder);
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