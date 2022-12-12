const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let Authorization = req.get("Authorization");
  if (!Authorization) {
    req.isAuth = false;
    return next();
  }
  try {
    const verification = jwt.verify(Authorization, process.env.PRIVATE_KEY);
    if (verification) {
      console.log(verification)
      req.isAuth = true;
      req.userId = verification.id;
      next();
    }
  } catch (error) {
    req.isAuth = false;
    return next();
  }
};
