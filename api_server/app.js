const express = require("express");
const app = express();
const joi = require("joi");

const PORT = process.env.PORT || 3001;

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

const { expressjwt: expressJWT } = require("express-jwt");
const config = require("./config");

app.use(
  expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api/],
  })
);

const userRouter = require("./router/user");
app.use("/api", userRouter);

app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err);

  if (err.name === "UnauthorizedError") return res.cc("Authentication failed!");

  res.cc(err);
});

app.listen(PORT, () => {
  console.log(`api server running at ${PORT}`); // http://127.0.0.1:3007");
});
