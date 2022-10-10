const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const dbPath = path.join(__dirname, "customerAddress.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("Server Running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


//Get Customer Details List
app.get("/selectCustomers", async (request, response) => {
  const getCustomerQuery = `
      SELECT
        *
      FROM
        customer
        NATURAL JOIN address;`;
  const customerArray = await db.all(getCustomerQuery);
  response.send(customerArray);
});

//Get Customer Detail//

app.get("/selectCustomers/:customerId/", async (request, response) => {
  const { customerId } = request.params;
  const getCustomer = `
      SELECT
        *
      FROM
        customer
        NATURAL JOIN address
      WHERE
      customerid = ${customerId};`;
  const customer = await db.get(getCustomer);
  response.send(customer);
});

//Adding Customer Details//
app.post("/selectCustomers/", async (request, response) => {
  const customerDetails = request.body;
  const {
    customerid,
    firstName,
    lastName,
    userName,
    email,
    phone,
    dob,
    gender,
  } = customerDetails;
  const addBookQuery = `
      INSERT INTO
        customer(customerid,firstName,lastName,userName,email,phone,dob,gender)
      VALUES
        (
          ${customerid},
           '${firstName}',
           '${lastName}',
           '${userName}',
           '${email}',
           ${phone},
          '${dob}',
           '${gender}',
         );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});

// '${addressId}',
// '${address}',
// '${landmark}',
// '${city}',
// '${state}',
// '${country}',
// '${zipCode}'
