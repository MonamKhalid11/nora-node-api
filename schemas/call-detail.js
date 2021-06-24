const mongoose = require('mongoose')

const callDetailSchema = mongoose.Schema({

    _id:mongoose.Schema.Types.ObjectId,
    Sid:String, 
    ParentCallSid: String,
    DateCreated: Date,
    DateUpdated: Date,
    AccountSid: String,
    To: String,
    From: String,
    PhoneNumberSid: String,
    Status: String,
    StartTime: Date,
    EndTime: Date,
    Duration: String,
    Price:String,
    Direction: String,
    AnsweredBy: String,
    ForwardedFrom: String,
    CallerName: String,
    Uri: String,
    RecordingUrl:String
    
})

module.exports= mongoose.model('callDetails',callDetailSchema)