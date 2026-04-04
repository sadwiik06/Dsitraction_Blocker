const mongoose  = require("mongoose");

const blockedsiteSchema = new mongoose.Schema({
    url: { type : String , required : true, unique : true},
    createdAt: {type : DataTransfer, default: Date.now}
});

module.exports = mongoose.model("BlockedSites", blockedsiteSchema);