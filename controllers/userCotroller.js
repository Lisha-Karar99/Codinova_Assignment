const User = require("../model/userModel.js");
const {
  user_schema,
  user_login_schema,
} = require("../model/validate/userValidate.js");
const hashPassword = require("../bcripted/password.js");
const tokenGenerate = require("../bcripted/tokenGenerate.js");
const jwt = require("jsonwebtoken");

// creating a new user
module.exports.signup = async (req, res) => {
  try {
    // check validation of coming data
    await user_schema.validateAsync(req.body);

    // bcrypt the password
    let bcryptedPassword = await hashPassword.bcryptPassword(req.body.password);

    // storing data into database
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcryptedPassword,
      userType: req.body.type,
    }); // once created do response

    return res.status(201).json({
      data: {
        username: user.username,
        email: user.email,
      },
      message: "You have registered",
    });
  } catch (error) {
    // if get a joi validation err
    if (error.name === "ValidationError") {
      return res.status(422).json({
          message: error.message,
      });
    }
    // if validation is fine but user exist
    if (error.name === "MongoServerError" || error.keyValue) {
      return res.status(403).json({
        message: "User already exist"
      })
      
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};

// login
module.exports.login = async (req, res) => {
  try {
    // check validation of coming data
    await user_login_schema.validateAsync(req.body);

    // get details of a user
    const user = await User.findOne({ email: req.body.email });
    // if user is signedUp
    if (user) {
      const userData = {
        id: user._id,
        type: user.userType,
      };
      // check password
      let matchPassword = await hashPassword.compareHashPassword(
        req.body.password,
        user.password
      );
      if (matchPassword) {
        // generate token
        let { access_token, refresh_token } =
          await tokenGenerate.generatedToken(userData);

        // return information
        return res.status(200).json({
          data: {
            access_token,
            refresh_token,
          },
          message: "Token Generated",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Email/Password is wrong",
        });
      }
    }
    // if user is not signedup
    else {
      return res.status(400).json({
        success: false,
        message: "You are not registered user",
      });
    }
  } catch (err) {
    // if get a joi validation err
    if (err.details) {

        return res.status(422).json({
            message: err.details[0].message
        });
  
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

// generate new access and refresh token using older refresh token
module.exports.newToken = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) {
      throw "Not authorized";
    }
    const payload = await jwt.verify(
      refreshToken,
      process.env.REFRESH_SEKRET_KEY
    );

    // generate token
    let { access_token, refresh_token } = await tokenGenerate.generatedToken(
      payload.data
    );

    // return information
    return res.status(200).json({
      data: {
        access_token,
        refresh_token,
      },
      message: "Token Generated",
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }
};
