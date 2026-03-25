const mongoose = require("mongoose")
const bycrpt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },

},
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next()
    const salt = await bycrpt.genSalt(10)
    this.password = await bycrpt.hash(this.password, salt)
    next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bycrpt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)
module.exports = User