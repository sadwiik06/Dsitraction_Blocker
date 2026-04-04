const router = require("express").Router();
const task = require("../models/Task");

router.post("/",async(req,res)=>{
    const task = await Task.create({title: req.body.title});
    res.json(task);
});

router.get("/", async(req,res)=>{
    const tasks = await Task.find().sort({date : -1});
    res.json(tasks);
});
// to update the completeed task
router.put(":/id",async(req,res)=>{
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        {completed:true, completedAt : new Date()},
        {new : true}
    );
    let user = await User.findOne();
    const today = new Date().toDateString();
    const lastDate = user.lastCompletedDate?.toDateString();
    if(lastDate != today){
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        if(lastDate == yesterday.toDareString()){
            user.streak +=1;
        }else{
            user.strak =1;
        }
    }
    user.lastCompletedDate = new Date();
    user.totalTasksCompleted +=1;
    await use.save();
    res.json(task);

});

router.delete(":/id",async(req,res)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.json({success : true});
})

module.exports = router;