const bcrypt = require(`bcryptjs`)
exports.encryptPassword = async (passw) => {
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(passw, salt);
    return newpassword;

}

exports.decryptPassword = async (req, hashpassword) => {
    const validPassword = await bcrypt.compare(
        req.body.password,
        hashpassword
    );

    if(validPassword) return true
    else false
}