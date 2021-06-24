const mongoose = require('mongoose')

const incomingCallSchema = mongoose.Schema({

    _id:mongoose.Schema.Types.ObjectId,
    CallSid:String, 
    StartTime: String
    
})

module.exports= mongoose.model('incomingcalls',incomingCallSchema)