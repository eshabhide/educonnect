const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const express = require('express')
const bodyParser = require('body-parser');
const validator = require('validator');
const cookieParser = require('cookie-parser')
const promise = require('promise');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.set('superSecret', 'notSecretPassword');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "root",
  database: "forum"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.static('public'))
app.set('view engine', 'pug')

function displayHome(req, res) {
  let inputData = req.cookies['cookie']
  let outputData = {};

  if (inputData == undefined || inputData.token == undefined) {
    return res.redirect('/login');
  }

  jwt.verify(inputData.token, app.get('superSecret'), function(err, decoded) {      
    if (err) {
      outputData.err = 'Error in token validation'
      outputData.msg = -1
    } else {
      outputData.msg = 0;
      outputData.name = 'Rahul';
    }
    
    if (outputData.msg == 0) {
      con.query("SELECT * FROM usermaster WHERE email = '" + inputData.email + "'", function (err, result, fields) {
        if (err) {
          outputData.msg = -1;
          return res.redirect('/login');
        } else {
          result = JSON.parse(JSON.stringify(result));
          outputData.name = result[0].name
          if (result[0].type == 1) {
            outputData.type = 1;
            let query = "SELECT * FROM subjects";
            executeQuery(query).then((queryResult) => {
              if (queryResult.msg == 0) {
                outputData.subjects = queryResult.data;
              } else {
                outputData.msg = -2;
                outputData.err = 'Unable to fetch subjects';
              }

              let dataQuery = "SELECT a.tutoremail, a.date, a.time, b.subjectName FROM studenttime AS a " +
                "INNER JOIN subjects AS b ON a.subject = b.subjectid WHERE studentemail = '" + inputData.email + "'";
              executeQuery(dataQuery).then((queryResult) => {
                if (queryResult.msg == 0) {
                  outputData.selfdata = queryResult.data;
                } else {
                  outputData.msg = -2;
                  outputData.err = 'Unable to fetch subjects';
                }
                outputData.name = inputData.name;
                return res.render('student', { 'respData' : JSON.stringify(outputData).replace(/<\//g, '<\\/') })
              });
            });
          } else {
            outputData.type = 2;
            let query = "SELECT * FROM subjects";
            executeQuery(query).then((queryResult) => {
              if (queryResult.msg == 0) {
                outputData.subjects = queryResult.data;
              } else {
                outputData.msg = -2;
                outputData.err = 'Unable to fetch subjects';
              }

              let dataQuery = "SELECT b.studentemail, a.date, a.time, c.subjectName FROM tutortime AS a " +
                "LEFT OUTER JOIN studenttime AS b ON a.email = b.tutoremail AND a.date = b.date AND a.time = b.time " +
                "INNER JOIN subjects AS c ON a.subject = c.subjectid " + 
                "WHERE a.email = '" + inputData.email + "'";

              executeQuery(dataQuery).then((queryResult) => {
                if (queryResult.msg == 0) {
                  outputData.selfdata = queryResult.data;
                } else {
                  outputData.msg = -2;
                  outputData.err = 'Unable to fetch subjects';
                }
                return res.render('home', { 'respData' : JSON.stringify(outputData).replace(/<\//g, '<\\/') })
              });
            });
          }
        }
      });
    } else {
      return res.redirect('/login');
    }
  });
}

function executeQuery(query) {
  let sqlResult = {};
  
  return new Promise((resolve, reject) => {
    con.query(query, function (err, result, fields) {
      if (err) {
        sqlResult.err = err;
        sqlResult.msg = -1;
      } else {
        sqlResult.msg = 0;
        sqlResult.data = result;
      }    
      resolve(JSON.parse(JSON.stringify(sqlResult)));
    });
  })
}

app.post('/api/register', function (req, res) {
  let sqlResult = {};
  let data = {};
  let inputData = req.body.data;

  let passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{1,50}$/;
  if(!passwordRegex.test(inputData.password)) {
    sqlResult.err = 'Password format is incorrect';
    sqlResult.msg = -5;
    return res.json(sqlResult);
  } else {
    data.password = inputData.password;
  }

  if (validator.isEmail(inputData.email)) {
    data.email = inputData.email;
  } else {
    sqlResult.err = 'Email format is incorrect';
    sqlResult.msg = -6;
    return res.json(sqlResult);
  }

  if (inputData.type == 'Student') {
    data.userType = 1; // Student
  } else if (inputData.type == 'Tutor') {
    data.userType = 2; // Tutor
  } else {
    sqlResult.err = 'Do not change the radio buttons';
    sqlResult.msg = -7;
    return res.json(sqlResult);
  }

  let nameRegex = /^[a-zA-Z0-9 .,]{1,50}$/;
  if(!nameRegex.test(inputData.name)) {
    sqlResult.err = 'Name format is incorrect';
    sqlResult.msg = -8;
    return res.json(sqlResult);
  } else {
    data.name = inputData.name;
  }

  if (data.name.length == 0 || data.email.length == 0 || data.password.length == 0  || data.userType.length == 0) {
    sqlResult.err = 'Some or all input fields are blank';
    sqlResult.msg = -4;
    return res.json(sqlResult);
  } else {
    con.query("SELECT email FROM usermaster WHERE email='" + data.email + "'", function (err, result, fields) {
      if (err) {
        sqlResult.err = 'Error in fetching from database';
        sqlResult.msg = -1;
        return res.json(sqlResult);
      } else {
        if (result.length === 0) {
          con.query("INSERT INTO usermaster VALUES ('" + data.email + "','" + data.password + "','" + data.name +
            "','" + data.userType + "')", function (err1, result1, fields1) {
            if (err1) {
              sqlResult.err = 'Error in creating user';
              sqlResult.msg = -2;
            } else {
              sqlResult.href = '/login'
              sqlResult.msg = 0;
            } 
            return res.json(sqlResult);
          })
        } else {
          sqlResult.err = 'This user already exists';
          sqlResult.msg = -3;
          return res.json(sqlResult);
        }
      }
    });
  }
})

app.post('/api/enterTime', function (req, res) {
  let inputData = req.cookies['cookie']
  let valid = 0;

  if (inputData == undefined || inputData.token == undefined) {
    return res.render('login');
  }
  
  jwt.verify(inputData.token, app.get('superSecret'), function(err, decoded) {      
    if (err) {
      
    } else {
      valid = 1;
    }
  });
  
  if (valid != 1) {
    return res.render('login') 
  }

  let sqlResult = {};
  let data = {};
  let inData = req.body.data;

  let query = "INSERT INTO tutortime VALUES";

  for (let x in inData.timePicked) {
    query += "('" + inputData.email + "','" + inData.datePicked + "','" + inData.timePicked[x] + "','" + inData.subject + "'),";
  }

  query = query.slice(0, -1);
  let outputData = {};
  executeQuery(query).then((queryResult) => {
    if (queryResult.msg == 0) {
      outputData.msg = 0;
      outputData.subjects = queryResult.data;
    } else {
      outputData.msg = -2;
      outputData.err = queryResult.err;
    }
    return res.json(outputData);
    //return res.render('home', { 'respData' : JSON.stringify(outputData).replace(/<\//g, '<\\/') })
  });
})

app.post('/api/login', function (req, res) {
  let sqlResult = {};
  let data = {};
  let inputData = req.body.data;

  if (inputData.password.trim().length == 0) {
    sqlResult.err = 'Password format is incorrect';
    sqlResult.msg = -5;
    return res.json(sqlResult);
  }

  let passwordRegex = RegExp(/^[a-zA-Z0-9!@#$%^&*]{1,50}$/);
  if ((!passwordRegex.test(inputData.password.trim()))) {
    sqlResult.err = 'Password format is incorrect';
    sqlResult.msg = -5;
    return res.json(sqlResult);
  } else {
    data.password = inputData.password.trim();
  }

  if (validator.isEmail(inputData.email)) {
    data.email = inputData.email;
  } else {
    sqlResult.err = 'Email format is incorrect';
    sqlResult.msg = -6;
    return res.json(sqlResult);
  }  
  
  if (data.email.length == 0 || data.password.length == 0) {
    sqlResult.err = 'Some or all input fields are blank';
    sqlResult.msg = -4;
    return res.json(sqlResult);
  } else {
    con.query("SELECT password, name FROM usermaster WHERE email='" + data.email + "'", function (err, result, fields) {
      result = JSON.parse(JSON.stringify(result));
      if (err) {
        sqlResult.err = 'Error in fetching from database';
        sqlResult.msg = -1;
        return res.json(sqlResult);
      } else {
        if (result.length === 0) {
          sqlResult.err = 'Authentication Failed. User not found.';
          sqlResult.msg = -3;
          return res.json(sqlResult);
        } else {
          if (data.password != result[0].password) {
            sqlResult.err = 'Authentication Failed. Wrong password.';
            sqlResult.msg = -2;
          } else {
            sqlResult.token = {};
            sqlResult.token.token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + (60 * 60),
              data: result[0].name
            },app.get('superSecret'));
            sqlResult.token.email = data.email;
            sqlResult.token.name = result[0].name;
            sqlResult.href = '/home'
            sqlResult.msg = 0;

            res.cookie('cookie', sqlResult.token);
          } 
          return res.json(sqlResult);
        }
      }
    }) 
  }
})

app.post('/home', function (req, res) {
  displayHome(req, res);
})

app.get('/home', function (req, res) {
  displayHome(req, res);
})

app.post('/api/listtutors', function (req, res) {
  let inputData = req.cookies['cookie']
  let valid = 0;

  if (inputData == undefined || inputData.token == undefined) {
    return res.render('login');
  }
  
  jwt.verify(inputData.token, app.get('superSecret'), function(err, decoded) {      
    if (err) {
      
    } else {
      valid = 1;
    }
  });
  
  if (valid != 1) {
    return res.render('login') 
  }

  let sqlResult = {};
  let data = {};
  let inData = req.body.data;

  let query = "SELECT a.* FROM forum.tutortime AS a NATURAL LEFT JOIN forum.studenttime AS b " +
    "WHERE b.tutoremail IS NULL AND subject = '" + inData.subject + "'";

  let outputData = {};
  executeQuery(query).then((queryResult) => {
    if (queryResult.msg == 0) {
      outputData.msg = 0;
      outputData.subjects = queryResult.data;
    } else {
      outputData.msg = -2;
      outputData.err = 'Unable to fetch subjects';
    }
    return res.json(outputData);
  });

})

app.post('/api/reservetime', function (req, res) {
  let inputData = req.cookies['cookie']
  let valid = 0;

  if (inputData == undefined || inputData.token == undefined) {
    return res.render('login');
  }
  
  jwt.verify(inputData.token, app.get('superSecret'), function(err, decoded) {      
    if (err) {
      
    } else {
      valid = 1;
    }
  });
  
  if (valid != 1) {
    return res.render('login') 
  }

  let sqlResult = {};
  let data = {};
  let inData = req.body.data;

  let query = "INSERT INTO studenttime VALUES";

  for (let x in inData.d) {
    query += "('" + inputData.email + "','" + inData.d[x].email + "','" + inData.d[x].date + "','" + 
      inData.d[x].time.toString().slice(0,2) + "','" + inData.subject + "'),";
  }

  query = query.slice(0, -1);
  let outputData = {};
  executeQuery(query).then((queryResult) => {
    if (queryResult.msg == 0) {
      outputData.msg = 0;
      outputData.subjects = queryResult.data;
    } else {
      outputData.msg = -2;
      outputData.err = 'Unable to fetch subjects';
    }
    return res.json(outputData);
  });
})

app.get('/login', function (req, res) {
  let inputData = req.cookies['cookie']
  let valid = 0;

  if (inputData == undefined || inputData.token == undefined) {
    return res.render('login');
  }
  
  jwt.verify(inputData.token, app.get('superSecret'), function(err, decoded) {      
    if (err) {
      
    } else {
      valid = 1;
    }
  });
  
  if (valid == 1) {
    return res.redirect('/home');
  } else {
    res.render('login') 
  }
})

app.get('/register', function (req, res) {
  res.render('register')
})

app.get('/logout', function (req, res) {
  res.cookie('cookie', 'cookie');
  return res.redirect('/');
})

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
