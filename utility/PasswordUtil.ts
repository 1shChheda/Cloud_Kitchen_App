import bcrypt from 'bcrypt';

    // Password Encryption & Decryption
        // generate a Salt
        // encrypt the password using the salt
        // use the same salt to decrypt the password during user Auth

export const GenerateSalt = async () => {
    const saltRounds = 10;
    return await bcrypt.genSalt(saltRounds);
}

export const EncryptedPassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}