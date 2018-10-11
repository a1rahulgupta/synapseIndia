
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
userModel = mongoose.model('userModel');
product = mongoose.model('product');
var validator = require('validator');
var config = require('../models/config');
var utility = require('../models/utility.js');
var waterfall = require('async-waterfall');
var async = require('async');
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');




router.post('/signup', function (req, res) {
  var finalResponse = {};
  finalResponse.userData = {};
  finalResponse.mailResponse = {};
  var userObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  }
  if (!userObj.firstName || !userObj.lastName || !userObj.email || !userObj.password) {
    res.json({
      code: 400,
      data: {},
      message: "Required Fields is missing"
    });
  } else if (userObj.email && !validator.isEmail(userObj.email)) {
    res.json({
      code: 400,
      data: {},
      message: "Invalid Email"
    });
  } else {
    waterfall([
      function (callback) { 
        userModel.existCheck(userObj.email.trim(), '', function (err, emailExist) {
          if (err) {
            callback(err, false);
          } else {
            if (!emailExist) {
              res.json({
                code: 400,
                data: {},
                message: "This email is already exist. please try again with different email."
              });
            } else {
              callback(null, finalResponse);
            }
          }
        });
      },
      function (finalResponse, callback) {
        var obj = {
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          email: userObj.email.toLowerCase(),
          password: userObj.password
        };

        var userRecord = new userModel(obj);
        userRecord.save(function (err, userData) {
          if (err) {
            callback(err, false);
          } else {
            finalResponse.userData = userData;
            callback(null, finalResponse);
          }
        });

      },
      function (finalResponse, callback) { 
        var date = new Date();
        finalResponse.verifyToken = utility.getEncryptText(Math.random().toString(4).slice(2) + date.getTime());
        finalResponse.verifingLink = config.webUrl + 'verify_account/' + finalResponse.verifyToken;

        userModel.findOneAndUpdate({
          _id: finalResponse.userData._id
        }, {
            $set: {
              verifyToken: finalResponse.verifyToken
            }
          }, function (err, updatedUserdata) {
            if (err) {
              callback(err, false);
            } else {
              callback(null, finalResponse);
            }
          });
      },
      function (finalResponse, callback) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: "devacc8410@gmail.com",
            pass: "Java@8410"
          }
        });

        var mailOptions = {
          from: 'nursinghomereview@gmail.com',
          to: finalResponse.userData.email,
          subject: 'Verify Account',
          html: `<blockquote><p>Hello ${finalResponse.userData.firstName},</p><p><br/></p><p>Congratulation! Your account has been created successfully. Please verify your account to click on the provide link below<br/></br> <a href= ${finalResponse.verifingLink}>Click here</a><a href= ${finalResponse.verifingLink}><br/></a><br/></p><p>If you have not made this request, please ignore this mail.</p><p><br/>Enjoy,<br/><br/></p></blockquote>`,
        };

        transporter.sendMail(mailOptions, function (err, response) {
          if (err) {
            callback(null, finalResponse);
          } else {
            finalResponse.mailResponse = response;
            callback(null, finalResponse);
          }
        })
      }
    ],
      function (err, data) {
        if (err) {
          res.json({
            code: 400,
            data: {},
            message: "Internal Error"
          });
        } else {
          res.json({
            code: 200,
            data: data,
            message: "You have signed up successfully. For verification, an email has been sent to you along with activation link over your mail.Please activate your account by clicking on link!"
          });
        }
      });
  }
})

router.post('/verifyAccount', function (req, res) {
  var finalResponse = {};
  finalResponse.userData = {};
  finalResponse.updatedUserData = {};
  waterfall([
    function (callback) {  
      userModel.findOne({
        verifyToken: req.body.verifyToken
      }).exec(function (err, userData) {

        if (err) {
          callback(err, false);
        } else {
          if (!userData) {
            res.json({
              code: 400,
              data: {},
              message: "Internal Error"
            });
          } else {
            finalResponse.userData = userData;
            callback(null, finalResponse);
          }
        }
      })
    },
    function (finalResponse, callback) { 
      if (finalResponse.userData.isDelete == true || finalResponse.userData.status == '1' || finalResponse.userData.status == '2') {
        res.json({
          code: 404,
          data: {},
          message: "Link Expired"
        });
      } else {
        userModel.findOneAndUpdate({
          verifyToken: req.body.verifyToken
        }, {
            $set: {
              status: '1',
            }
          }, function (err, data) {
            if (err) {
              callback(err, false);
            } else {
              finalResponse.updatedUserData = data;
              callback(null, finalResponse);
            }
          });
      }
    },
  ], function (err, data) {
    if (err) {
      res.json({
        code: 201,
        data: {},
        message: "Internal Error"
      });
    } else {
      res.json({
        code: 200,
        data: data,
        message: "Account Verified"
      });
    }
  });
})




router.post('/login', function (req, res) {
  var finalResponse = {};
  var condition = {};
  finalResponse.userData = {}
  var userObj = {
    email: req.body.email,
    password: req.body.password
  };
  if (!userObj.email || !userObj.password) {
    res.json({
      code: 400,
      data: {},
      message: "Required Fields is missing"
    });
  } else {
    waterfall([
      function (callback) {
        condition.email = userObj.email;
        condition.password = userObj.password;
        userModel.findOne(condition).exec(function (err, userData) {
          if (err) {
            callback(err, false);
          } else {
            if (!userData) {
              res.json({
                code: 406,
                data: {},
                message: "You have entered Invalid Username and Password"
              });
            } else if (userData.status == '0') {
              res.json({
                code: 500,
                data: {},
                message: "Your Account is not verified yet! Please check your mail and follow the instruction to verify your account."
              });
            } else {
              const JwtToken = jwt.sign({
                email: userData.email,
                _id: userData._id
              },
                'secret',
                {
                  expiresIn: 60 * 60 * 24 * 15
                });
              finalResponse.token = JwtToken;
              finalResponse.userData = userData;
              callback(null, finalResponse);
            }
          }
        })
      }
    ], function (err, data) {
      if (err) {
        res.json({
          code: 400,
          data: {},
          message: "Internal Error"
        });
      } else {
        res.json({
          code: 200,
          data: data,
          message: "Login Successfully"
        });
      }
    });
  }
});


router.get('/getAllProduct', function (req, res) {
  var finalResponse = {};
  finalResponse.productList = {};

  waterfall([
    function (callback) {
      product.find({}, function (err, productdata) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.productList = productdata;
          callback(null, finalResponse);
        }
      });
    },
  ], function (err, data) {
    if (err) {
      res.json({
        code: 201,
        data: {},
        message: "Internal Error"
      });
    } else {
      res.json({
        code: 200,
        data: data,
        message: "Record Found Successfully"
      });
    }
  });

})

router.post('/getMyProductList', function (req, res) {
  var finalResponse = {};
  finalResponse.productList = {};

  waterfall([
    function (callback) {
      userModel.findById({ _id: req.body.user_id }).populate('myProducts').exec(function (err, productdata) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.productList = productdata;
          callback(null, finalResponse);
        }
      });
    },
  ], function (err, data) {
    if (err) {
      res.json({
        code: 201,
        data: {},
        message: "Internal Error"
      });
    } else {
      res.json({
        code: 200,
        data: data,
        message: "Record Found Successfully"
      });
    }
  });

})


router.post('/addMyProduct', function (req, res) {
  var finalResponse = {};
  waterfall([
    function (callback) { 
      userModel.findById({
        _id: req.body.user_id
      }).exec(function (err, userData) {
        if (err) {
          callback(err, false);
        } else {
          if (userData) {
            userData.addmyProducts(req.body.productList).then(function (result) {
              callback(null, finalResponse);
            })
          }
        }
      })
    },
  ], function (err, data) {
    if (err) {
      res.json({
        code: 201,
        data: {},
        message: "Internal Error"
      });
    } else {
      res.json({
        code: 200,
        data: data,
        message: "Product Added to cart Successfully"
      });
    }
  });
})

module.exports = router;

