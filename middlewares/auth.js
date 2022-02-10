const admin = require("../firebase");
const User = require("../models/user");

module.exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    //authtoken was passed in the headers of the client's login post request
    req.user = firebaseUser; //modify the req object as it's passed to the controller
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

module.exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    res.status(403).json({
      error: "This is an Admin only resource.",
    });
  } else next();
};
