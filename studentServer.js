let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
 
  next();
});
var port = process.env.PORT || 2410
app.listen(port ,() => console.log(`Node app Listening on port ${port}!`))
let {studentsData} = require("./studentData")

let fs = require("fs");
let fname = "students.json"

app.get("/svr/resetData", function(req,res){
    let data = JSON.stringify(studentsData)
    fs.writeFile(fname, data, function(err)
    {
        if(err) res.status(404).send(err)
        else res.send("Data in the file is reset")
    })
})


app.get("/svr/students", function(req,res){
    fs.readFile(fname, "utf-8", function(err, data)
    {
        if(err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            res.send(studentsArr)
      }
    })
})



app.get("/svr/students/:id", function(req,res){
    let id = +req.params.id;
    fs.readFile(fname, "utf-8", function(err, data)
    {
        if(err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            let student = studentsArr.find((st) => st.id === id)
            if(student)
            {
                res.send(student)
            }
            else
            {
                res.status(404).send("No student found")
            }
      }
    })
})

app.get("/svr/students/course/:name", function(req,res){
    let courseName = req.params.name;
    fs.readFile(fname, "utf-8", function(err, data)
    {
        if(err) res.status(404).send(err)
        else {
            let studentsArr = JSON.parse(data)
            let filtersStudent = studentsArr.filter((st) => st.course === courseName)
            res.send(filtersStudent)
      }
    })
})


app.post("/svr/students", function(req,res){
    let body = req.body;
    fs.readFile(fname, "utf-8", function(err,data)
    {
        if(err) res.status(404).send(err)
        else
        {
            let studentsArr = JSON.parse(data);
            let maxid = studentsArr.reduce((acc,curr) => curr.id >= acc ? curr.id : acc, 0)
            let newid = maxid +1;
            let newStudent = {id : newid, ...body}
            studentsArr.push(newStudent);
            let data1 = JSON.stringify(studentsArr)
            fs.writeFile(fname, data1, function(err)
            {
                if(err) res.status(404).send(err)
                else res.send(newStudent)
            })
        }
    })
})


app.put("/svr/students/:id", function(req,res){
    let body = req.body;
    let id = +req.params.id
    fs.readFile(fname, "utf-8", function(err,data)
    {
        if(err) res.status(404).send(err)
        else
        {
            let studentsArr = JSON.parse(data);
            let index = studentsArr.findIndex((st) => st.id === id)
            if(index >=0)
            {
                let updateStudent = {id : id, ...body}
                studentsArr[index] = updateStudent;
                let data1 = JSON.stringify(studentsArr)
                fs.writeFile(fname, data1, function(err)
                {
                    if(err) res.status(404).send(err);
                    else res.send(updateStudent)
                })
            }
            else
            {
                res.status(404).send("No student found")
            }
        }
    })
})

app.delete("/svr/students/:id", function(req,res){
    let id = +req.params.id
    fs.readFile(fname, "utf-8", function(err,data)
    {
        if(err) res.status(404).send(err)
        else
        {
            let studentsArr = JSON.parse(data);
            let index = studentsArr.findIndex((st) => st.id === id)
            if(index >=0)
            {
                let deleteStudent = studentsArr.splice(index,1)
                let data1 = JSON.stringify(studentsArr)
                fs.writeFile(fname, data1, function(err)
                {
                    if(err) res.status(404).send(err);
                    else res.send(deleteStudent)
                })
            }
            else
            {
                res.status(404).send("No student found")
            }
        }
    })
})