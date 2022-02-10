const User = require("../models/user");

module.exports.createOrUpdateUser = async (req, res) => {
  try {
    const { email } = req.user;
    //req.user is from the authCheck middleware fn

    //filter, update, return new document
    const user = await User.findOneAndUpdate(
      { email },
      { name: email.split("@")[0] },
      { new: true }
    );

    if (user) {
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        name: email.split("@")[0],
      }).save();
      res.json(newUser);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: `Create or Update failed: ${err.message}` });
  }
};

module.exports.currentUser = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (user) res.json(user);
};
