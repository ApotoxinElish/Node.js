const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.regUser = (req, res) => {
  const userinfo = req.body;
  if (!userinfo.username || !userinfo.password) {
    return res.send({
      status: 1,
      message: "The username or password is invalid!",
    });
  }

  const sqlStr = "select * from user_table where username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      // return res.send({ status: 1, message: err.message });
      return res.cc(err);
    }

    if (results.length > 0) {
      // return res.send({
      //   status: 1,
      //   message: "The user name is occupied. Please change the user name.",
      // });
      return res.cc("The user name is occupied. Please change the user name.");
    }

    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    const sql = "insert into user_table set ?";
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        // if (err) return res.send({ status: 1, message: err.message });
        if (err) return res.cc(err);

        // if (results.affectedRows !== 1)
        //   return res.send({
        //     status: 1,
        //     message: "Failed to register user, please try again later!",
        //   });
        if (results.affectedRows !== 1)
          return res.cc("Failed to register user, please try again later!");

        // res.send({ status: 0, message: "Registration successful!" });
        res.cc("Registration successful!", 0);
      }
    );
  });
};

exports.login = (req, res) => {
  const userinfo = req.body;

  const sql = "select * from user_table where username=?";
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err);

    if (results.length <= 0) return res.cc("Login failed!");

    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );

    if (!compareResult) return res.cc("Login failed!");

    const user = { ...results[0], password: "", user_pic: "" };
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });

    res.send(results[0]); // send all data fo one record to client
    /*
    res.send({
      status: 0,
      message: "Login successful!",
      token: "Bearer " + tokenStr,
    });
    */
  });
};

exports.logout = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var user = req.body.username;
  var pswpsw = req.body.password;
  var token = req.body.token;
  const emigrationCode = JSON.stringify(req.body); //encrypt
  var vCode = "";
  updateData("token", [vCode, user, pswpsw]);
  res.send(req.body);
  return true;
  //  connection.end();
};

exports.login1 = (req, res) => {
  console.log(req.body);
  res.header("Access-Control-Allow-Origin", "*");
  var user = req.body.username;
  var pswpsw = req.body.password;
  var sqlchar =
    'SELECT * from usertable where username="' +
    user +
    '" and password="' +
    pswpsw +
    '"';
  let loginCount = 0;
  let bodytmp = {
    username: "",
    password: "",
    token: "",
    logincount: 0,
  };

  //  connection.connect();
  let endtime = Math.floor(new Date().getTime() / 1000);
  console.log(sqlchar, endtime);
  connection.query(sqlchar, function (error, results, fields) {
    if (error) {
      throw error;
      return false;
    } else {
      if (results.length < 1) {
        sqlchar = "The password is not correct!";
        console.log(sqlchar, "");
        req.body.password = "ERROR_PASSWORD";
        req.body.token = ""; //set token = ''
      } else {
        sqlchar = "The password is correct!";
        console.log(sqlchar, results[0].Username);
        sqlchar += results[0].solution;
        req.body.token = db.randomWord(false, 128, 128); //create new token ; RandomUtil.generateLowerString(16) ;

        if (results[0].Logincount != null) loginCount = results[0].Logincount;
        loginCount++;
        if (loginCount <= 5) {
          updateToken([req.body.token, loginCount, user, pswpsw]);
          // log in max times
          console.log("log in count is ", loginCount);
        } else {
          req.body.password = "ERROR_LOGINCOUNT";
          req.body.token = ""; //set token = ''
        }
      }
      bodytmp.username = req.body.username;
      bodytmp.password = req.body.password;
      bodytmp.token = req.body.token;
      bodytmp.logincount = loginCount;
      res.send(bodytmp);
      return true;
    }
  });
  //  connection.end();
};

exports.login2 = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  var user = req.body.user;
  var token = req.body.token;
  var sqlchar =
    'SELECT password AS solution from usertable where username="' +
    user +
    '" and token="' +
    token +
    '"';
  //  connection.connect();
  let endtime = Math.floor(new Date().getTime() / 1000);
  console.log(sqlchar, endtime);
  connection.query(sqlchar, function (error, results, fields) {
    if (error) {
      throw error;
      return false;
    } else {
      if (results.length < 1) {
        sqlchar = "The token is not correct!" + endtime.toString();
        req.body.pswpsw = "ERROR";
        req.body.token = ""; //set token = ''
      } else {
        sqlchar = "The token is correct!" + endtime.toString();
      }
      console.log(sqlchar, ""); // results[0].solution);
      res.send(req.body);
      return true;
    }
  });
  //  connection.end();
};

exports.login3 = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  var user = req.body.username;
  var pswpsw = req.body.password;
  var token = req.body.token;
  const emigrationCode = JSON.stringify(req.body); //encrypt
  var vCode = db.Base64encode(emigrationCode);

  updateData("UserStateInfo", [vCode, user, pswpsw]);

  res.send(req.body);
  return true;

  //});
  //  connection.end();
};

exports.login4 = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  var username = req.body.username;
  var token = req.body.token;
  var sqlchar =
    'SELECT UserStateInfo AS solution from usertable where username="' +
    username +
    '"' +
    'and token="' +
    token +
    '"';

  //  connection.connect();
  let endtime = Math.floor(new Date().getTime() / 1000);
  console.log(sqlchar, endtime);
  connection.query(sqlchar, function (error, results, fields) {
    if (error) {
      throw error;
      return false;
    } else {
      if (results.length < 1) {
        sqlchar = "The token is not correct!";
        console.log(sqlchar, "");
        req.body.pswpsw = "ERROR";
        req.body.token = ""; //set token = ''
      } else {
        //        sqlchar = 'The token is correct!';
        var vCode = "";
        if (null !== results[0].solution)
          vCode = db.Base64decode(results[0].solution); //decode
        if (vCode == "") {
          //user game info is ''   admin control
          req.body.indexChar = 0;
          req.body.loginState = 0;
          req.body.loginCount = 0;
          req.body.sessionTime = 600;
        } else req.body = vCode;
        console.log(sqlchar, vCode);
      }
      res.send(req.body);
      return true;
    }
  });
  //  connection.end();
};

exports.login5 = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  var username = req.body.user;
  var password = req.body.pswpsw;
  var sqlchar = 'SELECT * from usertable where username!="admin"';
  //  var sqlchar = 'SELECT UserStateInfo AS solution from usertable where username="' + username + '"' + 'and token="' + token + '"'

  //  connection.connect();
  let endtime = Math.floor(new Date().getTime() / 1000);
  console.log(sqlchar, endtime);
  connection.query(sqlchar, function (error, results, fields) {
    if (error) {
      throw error;
      return false;
    } else {
      if (results.length < 1) {
        sqlchar = "The token is not correct!";
        console.log(sqlchar, "");
        req.body.pswpsw = "ERROR";
        req.body.token = ""; //set token = ''  // have bugs in  near lines
      } else {
        //        sqlchar = 'The token is correct!';
        // var vCode = "";
        for (var i = 0; i < results.length; i++) {
          var tmp = db.Base64decode(results[i].UserStateInfo); // results[i].UserStateInfo == null or '' ？？
          results[i] = {};
          if (
            null !== results[i].UserStateInfo &&
            results[i].UserStateInfo !== ""
          )
            results[i] = results[i].UserStateInfo ? JSON.parse(tmp) : {};
        }
        var vCode = JSON.stringify(results);
        req.body = vCode;
        sqlchar = vCode;
        console.log(sqlchar, "");
      }
      res.send(req.body);
      return true;
    }
  });
  //   connection.end();
};

exports.readwordlist = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  var worddata = fs.readFileSync("../../wordlist.txt");
  var wordlist = worddata.toString().split("\r\n");
  console.log(wordlist);
  res.send(JSON.stringify(wordlist));
};
