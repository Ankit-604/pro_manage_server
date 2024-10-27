const userRouter = require("express").Router();

const registerUser = require("../controllers/registerUser");
const loginUser = require("../controllers/loginUser");
const validateUser = require("../middlewares/validateUser");
const getUserDetails = require("../controllers/getUserDetails");
const getUsers = require("../controllers/getUsers");
const validateToken = require("../middlewares/validateToken");
const updateUserDetails = require("../controllers/updateUserDetails");
const validateUpdateInput = require("../middlewares/validateUpdateInput");

userRouter.post("/register", validateUser, registerUser);
userRouter.post("/login", validateUser, loginUser);
userRouter.get("/search", validateToken, getUsers);
userRouter.get("/", validateToken, getUserDetails);
userRouter.put(
  "/updateuser",
  validateToken,
  validateUpdateInput,
  updateUserDetails
);

module.exports = userRouter;
