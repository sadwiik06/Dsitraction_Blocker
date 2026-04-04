const mongoose = require("mongoose");

const userSchema  = new mongoose.schema({
    streak:{type: Number, default : 0},
    lastCompletedDate : {Type: Date},
    totalTasksCompleted : {type: Number, default :0},
    rewardTimeRemaining : {type : Number, default : 0},
    rewardActive : {type : Boolean, default : false}
});

module.exports = mongoose.model("User",userSchema);