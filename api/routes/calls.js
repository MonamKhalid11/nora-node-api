const express = require('express')
const axios = require('axios')
const router = express.Router()
const mongoose = require('mongoose')
const callDetailSchema = require('../../schemas/call-detail')
const CTOFormSchema = require('../../schemas/CTO-form')
const incomingCallSchema= require('../../schemas/incoming-call')
const { google } = require("googleapis")
require('dotenv').config();




router.get('/saveCallData',(req, res, next)=>{
    
    const CallSid=req.query.CallSid;
    const StartTime=req.query.StartTime;

    const IncomingCallData=new incomingCallSchema({
        _id:new mongoose.Types.ObjectId,
        CallSid:CallSid, 
        StartTime: StartTime
    })

    IncomingCallData
    .save()
    .then(result => {
        console.log(result);
    })

    res.json({
        data:req.query
    });


})


router.get('/getDetail/:referenceId',(req, res, next)=>{

    const referenceId=req.params.referenceId;

    let url = 'https://'+process.env.API_KEY+':'+process.env.API_TOKEN+'@'+process.env.EXOTEL_DOMAIN+'/v1/Accounts/'+process.env.EXOTEL_SID+'/Calls/'+referenceId+'.json';
    console.log(url)
    axios({
        method:'get',
        url
    })
    .then(function (response) {

        const ApiResponse=JSON.stringify(response.data.Call)
        let test = JSON.parse(ApiResponse)
        
        const CallData=new callDetailSchema({
            _id:new mongoose.Types.ObjectId,
            Sid:test.Sid, 
            ParentCallSid: test.ParentCallSid,
            DateCreated: test.DateCreated,
            DateUpdated: test.DateUpdated,
            AccountSid: test.AccountSid,
            To: test.To,
            From: test.From,
            PhoneNumberSid: test.PhoneNumberSid,
            Status: test.Status,
            StartTime: test.StartTime,
            EndTime: test.EndTime,
            Duration: test.Duration,
            Price:test.Price,
            Direction: test.Direction,
            AnsweredBy: test.AnsweredBy,
            ForwardedFrom: test.ForwardedFrom,
            CallerName: test.CallerName,
            Uri: test.Uri,
            RecordingUrl:test.RecordingUrl
        })

        CallData
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err))

        res.json({
            msg:{
                message:'Data Stored Successfully!'
            }
        });
    })
    .catch(function (error) {
        res.json({
            error:{
                message:error
            }
        });
    });

});

router.post('/cto_form',async(req, res, next)=>{

    const getDate=req.body.date
    const getFormId=req.body.form_id

    var session_url = 'https://noorahealth.surveycto.com/api/v2/forms/data/wide/json/'+getFormId+'?date='+getDate+'';
    var username = 'monamkhalid@gmail.com';
    var password = 'l1f12bscs2001';
    var credentials = Buffer.from(username + ':' + password).toString('base64');
      var basicAuth = 'Basic ' + credentials;
    let instance = axios.create({
        headers: {
            'Authorization':basicAuth
        }
    });
   await instance.get(session_url,{
        }).then( async function(response) {
        
        const ApiResponse=JSON.stringify(response.data)
        let test = JSON.parse(ApiResponse)
        var Records=0
        var RowValues=[]

        var RowHeading=
        [   "CompletionDate",
            "SubmissionDate",
            "starttime",
            "endtime",
            "deviceid",
            "subscriberid",
            "simid",
            "devicephonenum",
            "username",
            "duration",
            "text_audit",
            "interview_audit",
            "investigator_name",
            "searchtype",
            "searchtext",
            "caseid",
            "patient_name",
            "patient_sex",
            "patient_mobile",
            "patient_age",
            "patient_district_name",
            "date_tested_positive",
            "group_type",
            "confirm_ptdata",
            "to_number",
            "from_number",
            "response",
            "contact",
            "nocontact",
            "refusal_reason",
            "headings_count",
            "thanks",
            "comment",
            "instanceID",
            "instanceName",
            "formdef_version",
            "review_quality",
            "review_status",
            "KEY" 
        ]

        RowValues.push(RowHeading)



        test.map(item => {

            const FormData=new CTOFormSchema({

            _id:new mongoose.Types.ObjectId,
            CompletionDate: item.CompletionDate,
            SubmissionDate: item.SubmissionDate,
            starttime: item.starttime,
            endtime: item.endtime,
            deviceid: item.deviceid,
            subscriberid: item.subscriberid,
            simid: item.simid,
            devicephonenum: item.devicephonenum,
            username: item.username,
            duration: item.duration,
            text_audit:item.text_audit,
            interview_audit: item.interview_audit,
            investigator_name: item.investigator_name,
            searchtype: item.searchtype,
            searchtext: item.searchtext,
            caseid: item.caseid,
            patient_name: item.patient_name,
            patient_sex: item.patient_sex,
            patient_mobile: item.patient_mobile,
            patient_age: item.patient_age,
            patient_district_name: item.patient_district_name,
            date_tested_positive:item.date_tested_positive,
            group_type: item.group_type,
            confirm_ptdata: item.confirm_ptdata,
            to_number: item.to_number,
            from_number:item.from_number,
            response: item.response,
            contact: item.contact,
            nocontact: item.nocontact,
            refusal_reason: item.refusal_reason,
            headings_count: item.headings_count,
            thanks: item.thanks,
            comment: item.comment,
            instanceID: item.instanceID,
            instanceName: item.instanceName,
            formdef_version: item.formdef_version,
            review_quality: item.review_quality,
            review_status: item.review_status,
            KEY: item.KEY

            });

            //save into mongo DB
            FormData.save().then(result => {
                //console.log(result);
            }).catch(err => console.log(err))
            Records++

            // value of single row for spreadsheet
            // var SingleRowValue=[
            //     item.CompletionDate,
            //     item.SubmissionDate,
            //     item.starttime,
            //     item.endtime,
            //     item.deviceid,
            //     item.subscriberid,
            //     item.simid,
            //     item.devicephonenum,
            //     item.username,
            //     item.duration,
            //     item.text_audit,
            //     item.interview_audit,
            //     item.investigator_name,
            //     item.searchtype,
            //     item.searchtext,
            //     item.caseid,
            //     item.patient_name,
            //     item.patient_sex,
            //     item.patient_mobile,
            //     item.patient_age,
            //     item.patient_district_name,
            //     item.date_tested_positive,
            //     item.group_type,
            //     item.confirm_ptdata,
            //     item.to_number,
            //     item.from_number,
            //     item.response,
            //     item.contact,
            //     item.nocontact,
            //     item.refusal_reason,
            //     item.headings_count,
            //     item.thanks,
            //     item.comment,
            //     item.instanceID,
            //     item.instanceName,
            //     item.formdef_version,
            //     item.review_quality,
            //     item.review_status,
            //     item.KEY
            // ]

            RowValues.push(SingleRowValue)
        })


        // const auth = new google.auth.GoogleAuth({
        //     keyFile: "credentials.json",
        //     scopes: "https://www.googleapis.com/auth/spreadsheets",
        // });
    
        // // Create client instance for auth
        // const client = await auth.getClient();
        // // Instance of Google Sheets API
        // const googleSheets = google.sheets({ version: "v4", auth: client });
        // const spreadsheetId = "15DrBw9TUg_WmDv9A9E9nZ9wQai2aM-_wI8IVd-gkx4c";
        
        // await googleSheets.spreadsheets.values.append({
        //     auth,
        //     spreadsheetId,
        //     range: "Sheet1!A:AM",
        //     valueInputOption: "USER_ENTERED",
        //     resource: {
        //     values: RowValues,
        //     },
        // });
        res.json({
            msg:'Data Saved In Google Sheets Successfully!',
            totalRecords:Records
        });
      }).catch(function(error) {
        res.json({
            msg:'error',
            response:error
    
        });
        // console.log('Error on Authentication',error);
      });
    


});


// router.post('/sheet',async(req, res, next)=>{

//     const auth = new google.auth.GoogleAuth({
//         keyFile: "credentials.json",
//         scopes: "https://www.googleapis.com/auth/spreadsheets",
//     });

//     // Create client instance for auth
//     const client = await auth.getClient();
//     // Instance of Google Sheets API
//     const googleSheets = google.sheets({ version: "v4", auth: client });
//     const spreadsheetId = "1ZZnFpZ6yrpHOlsMizgW-fJ8Z7FHBNlbZ6bSsgNZJBNA";
//     // Get metadata about spreadsheet
//     const metaData = await googleSheets.spreadsheets.get({
//         auth,
//         spreadsheetId,
//     });

//     // const getRows = await googleSheets.spreadsheets.values.get({
//     //     auth,
//     //     spreadsheetId,
//     //     range: "Sheet1!A:E",
//     //   });

//     // Write row(s) to spreadsheet
    

//     res.json({
//         msg:"Data Inetrsted Successfully!"
//     });
    
    
   


// });





module.exports = router;