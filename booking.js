const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3005;
const url = "mongodb://localhost:27017";
const dbName = 'travelBooking';
const collectionName = 'bookings';

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit-booking', async (req, res) => {
  const bookingData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
    gender: req.body.gender,
    fromLocation: req.body.fromLocation,
    destinationLocation: req.body.destinationLocation,
    dateOfJourney: req.body.dateOfJourney,
    numberOfPassengers: parseInt(req.body.numberOfPassengers),
    price: parseFloat(req.body.price),
    pickupLocation: req.body.pickupLocation,
    typeOfBus: req.body.typeOfBus
  };

  try {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect(); // Connect to the database
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne(bookingData);
    console.log('Booking created successfully');

    // Redirect to booking confirmation page
    res.redirect(`/booking-details.html?firstName=${bookingData.firstName}&fromLocation=${bookingData.fromLocation}&destinationLocation=${bookingData.destinationLocation}&dateOfJourney=${bookingData.dateOfJourney}&numberOfPassengers=${bookingData.numberOfPassengers}&price=${bookingData.price}&pickupLocation=${bookingData.pickupLocation}&typeOfBus=${bookingData.typeOfBus}`);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err); // Log MongoDB connection error
    res.status(500).send('Error creating booking');
  }
}); 

// Route to display booking details and confirmation message
app.get('/booking-details.html', (req, res) => {
  // Retrieve booking details from query parameters
  const bookingDetails = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    fromLocation: req.query.fromLocation,
    destinationLocation: req.query.destinationLocation,
    dateOfJourney: req.query.dateOfJourney,
    numberOfPassengers: req.query.numberOfPassengers,
    price: req.query.price,
    pickupLocation: req.query.pickupLocation,
    typeOfBus: req.query.typeOfBus
  };

  // Render booking confirmation page with booking details
  res.send(`
    <html>
      <head>
        <style>
          body {
            // background-image: url('https://t3.ftcdn.net/jpg/05/22/28/88/360_F_522288844_uOhW8dQAb9a5kLzZjrVfByHerTmvjTZm.jpg');
            background-size: cover;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
          }
          .container {
            width: 60%;
            margin: 5% auto;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.7); /* Semi-transparent white background */
            border-radius: 20px;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1); /* Adding a subtle shadow for depth */
            text-align: center; /* Center align content */
          }
          h1 {
            color: #136c80; /* Darker color for the heading */
            font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; /* Change the font to Roboto */
            font-weight: bold; /* Ensure bold font weight */
            margin-bottom: 20px; /* Add space below the heading */
          }
          .booking-success {
            color: green;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .booking-details {
            text-align: left; /* Align details to the left */
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Booking Details</h1>
          <div class="booking-success">Booking Successful!</div>
          <div class="booking-details">
          <p>Name: ${bookingDetails.firstName}</p>
            <p>From: ${bookingDetails.fromLocation}</p>
            <p>To: ${bookingDetails.destinationLocation}</p>
            <p>Date of Journey: ${bookingDetails.dateOfJourney}</p>
            <p>Number of Passengers: ${bookingDetails.numberOfPassengers}</p>
            <p>Price: ${bookingDetails.price}</p>
            <p>Pickup Location: ${bookingDetails.pickupLocation}</p>
            <p>Type of Bus: ${bookingDetails.typeOfBus}</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Connected to MongoDB server');
});
