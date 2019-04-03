/*
  generates jwt token
*/
const jwt = require(`jsonwebtoken`);
exports.token = (role, loginId, key) => {
    const token = jwt.sign({ role: role, loginId: loginId }, key, {expiresIn : 604800});                             // we are storing id as payload and getting private key from config file
    return token;
};