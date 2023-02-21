const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require('dotenv').config();
const URL = process.env.DB;
//middleware
app.use(express.json());

const rooms = [];
const customers = [];

app.get("/", function(request, response) {
   
  response.send("Welcome to Hall Booking App");

} )

//get(display) rooms
app.get("/rooms", async function (request, response) {
  try {
    // Open the connection
    const connection = await mongoClient.connect(URL);
    // Select DB
    const db = connection.db("hallbooking");
    // select the collection and do operation
    let rooms = await db.collection("rooms").find().toArray();
    // Close the connection
    await connection.close();

    response.json(rooms);
  } catch (error) {
    console.log(error);
  }
});

//get(display) customers
app.get("/customers", async function (request, response) {
  try {
    // Open the connection
    const connection = await mongoClient.connect(URL);
    // Select DB
    const db = connection.db("hallbooking");
    // select the collection and do operation
    let customers = await db.collection("customers").find().toArray();
    // Close the connection
    await connection.close();

    response.json(customers);
  } catch (error) {
    console.log(error);
  }
});

//post(insert) rooms
app.post("/room", async function (request, response) {
  try {
    // Open the connection
    const connection = await mongoClient.connect(URL);
    // Select DB
    const db = connection.db("hallbooking");
    // select the collection and do operation
    await db.collection("rooms").insertOne(request.body);
    // Close the connection
    await connection.close();

    response.json({
      message: "Rooms added successfully!!!",
    });
  } catch (error) {
    console.log(error);
  }
  // request.body.id = rooms.length + 1;
  // console.log(request.body);
  // rooms.push(request.body);
  // response.json({
  //   message: "Rooms added successfully!!!",
  // });
});

//post(booking) rooms
app.post("/bookroom", async function (request, response) {
  try {
    // Open the connection
    const connection = await mongoClient.connect(URL);
    // Select DB
    const db = connection.db("hallbooking");
    // select the collection and do operation
    await db.collection("customers").insertOne(request.body);
    // Close the connection
    await connection.close();

    response.json({
      message: "Customers and booking details added successfully!!!",
    });
  } catch (error) {
    console.log(error);
  }
  // request.body.id = customers.length + 1;
  // console.log(request.body);
  // customers.push(request.body);
  // response.json({
  //   message: "Customers and booking details added successfully!!!",
  // });
});

//get roomsbooked
app.get("/roomsbooked", async function (request, response) {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "roomID",
          as: "customer",
        },
      },
      {
        $addFields: {
          reservation: {
            $cond: [
              {
                $eq: ["$customer", []],
              },
              "Not booked",
              "Booked",
            ],
          },
        },
      },
    ]
    // Open the connection
    const connection = await mongoClient.connect(URL);
    // Select DB
    const db = connection.db("hallbooking");
    const result =await db
      .collection("rooms")
      .aggregate(pipeline)
      .toArray();
      
    response.json(result);
  } catch (error) {
    console.log(error);
  }
});

//listen
app.listen(process.env.PORT || 3002);

// db.rooms.aggregate([
//   {
//     $lookup: {
//       from: "customers",
//       localField: "_id",
//       foreignField: "roomID",
//       as: "result",
//     },
//   },
//   {
//     $cond: {
//       if: { $size: 1 },
//       then: { $addFields: { isBooked: "Yes" } },
//       else: { $addFields: { isBooked: "No" } },
//     },
//   },
// ]);