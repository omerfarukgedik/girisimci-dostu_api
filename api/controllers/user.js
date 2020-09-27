const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validateUser } = require("../../utils/db");
const {
  serializeUser,
  validateUsername,
  validateEmail,
} = require("../../utils/auth");

const users = async (req, res) => {
  try {
    const users = await User.find({});

    let serializedUsers = [];

    users.forEach((user) => {
      serializedUsers.push(serializeUser(user));
    });

    return res.status(201).json(serializedUsers);
  } catch (err) {
    return res.status(203).json({
      message:
        "Kullanıcılara erişirken hata oluştu. Lütfen daha sonra tekrar deneyin.",
      success: false,
    });
  }
};

const addUser = async (user, res) => {
  try {
    let usernameTaken = await validateUsername(user.username);
    if (!usernameTaken) {
      return res.status(203).json({
        message: "Kullanıcı adı zaten alınmış.",
        success: false,
      });
    }

    let emailTaken = await validateEmail(user.email);
    if (!emailTaken) {
      return res.status(203).json({
        message: "Bu e-posta adresi ile daha önce kayıt olunmuş.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const newUser = new User({
      ...user,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Başarılı bir şekilde kullanıcı oluşturdunuz.",
      success: true,
      user: newUser.name,
    });
  } catch (err) {
    return res.status(203).json({
      message: "Kullanıcı oluşturulurken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

const delUser = async (userId, res) => {
  try {
    const u = await validateUser(userId);
    if (!u)
      return res.status(203).json({
        message: "Kullanıcı bulunamadı :(",
        success: false,
      });

    // delete category
    await User.findByIdAndDelete(userId);

    return res.status(201).json({
      message: `${u.name} adlı kullanıcıyı başarılı bir şekilde sildiniz.`,
      success: true,
    });
  } catch (err) {
    //implement logger function winston
    return res.status(203).json({
      message:
        "Kullanıcı silinirken hata oluştu. Lütfen daha sonra tekrar deneyin.",
      success: false,
    });
  }
};

const updateUser = async (userId, name, res) => {
  try {
    const u = await validateUser(userId);

    if (!u)
      return res.status(203).json({
        message: "Kullanıcı bulunamadı :(",
        success: false,
      });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(201).json({
      message: `Kullanıcıyı başarılı bir şekilde güncellediniz.`,
      success: true,
      user: updatedUser.name,
    });
  } catch (err) {
    return res.status(203).json({
      message: "Kullanıcı güncellenirken hata oluştu. Lütfen tekrar deneyin.",
      success: false,
    });
  }
};

module.exports = { users, addUser, delUser, updateUser };
