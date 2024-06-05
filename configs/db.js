const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        } else {
            await mongoose.connect("mongodb://localhost:27017/tahlil")
        }
    } catch (err) {
        console.log("DB Connection has Error :((((", err)
    }
}

export default connectToDB;