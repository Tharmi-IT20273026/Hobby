//DB initialization
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app =express();
app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hobby"

})

// get all hubbies details
app.get("/hobbyList", (req,res) =>{
    const sql = "SELECT * FROM hobbyinfo";
    db.query(sql, (err,data)=>{
        if(err) return res.json("Error");
        return res.json(data);
    })
})

// user can post the user hobby credencials

app.post("/posthobby", (req, res) => {
    const sql = "INSERT INTO hobbyinfo (`Hobby`, `user`, `email`, `contactNo`) VALUES (?,?,?,?)";
    const values = [
      req.body.Hobby,
      req.body.user,
      req.body.email,
      req.body.contactNo,
    ];
  
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return res.status(500).json("Error");
      }
      return res.json(data);
    });
  });

  // delete any user hobbies 

  app.delete('/Hobby/:hobbyId',(req,res)=>{
    const sql="DELETE FROM hobbyinfo WHERE hobbyId =?";
    const id = req.params.hobbyId;

    db.query(sql, [id], (err,data)=>{
        if(err) return res.json("error123");
        return res.json(data);
    })
})

// user can update the required credials as required

app.put("/updatehobby/:hobbyId", (req, res) => {
    const hobbyId = req.params.hobbyId;
    const { Hobby, userName, email, contactNo} = req.body;
  
    const sql = "UPDATE hobbyinfo SET Hobby = ?, userName = ?, email = ?, contactNo = ?";
    const values = [Hobby, userName, email, contactNo];
  
    db.query(sql, values, (err, data) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return res.status(500).json("Error");
      }
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "hobby not found" });
      }
  
      return res.json({ message: "Hobby updated successfully" });
    });
  });


  // Define customer login route
app.post('/ulogin', (req, res) => {
    const { user, password } = req.body;
  
    // Check if the user exists in the database
    const checkUserQuery = 'SELECT * FROM userlogin WHERE user = ? AND password = ?';
    db.query(checkUserQuery, [user, password], (err, results) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        res.status(500).json({ error: 'An internal server error occurred' });
        return;
      }
  
      if (results.length === 0) {
        // User not found or invalid credentials
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        // User logged in successfully
        res.status(200).json({ message: 'Login successful' });
      }
    });
  });
app.listen(8081, ()=>{

    console.log("Hii Octopus Bi");
})
