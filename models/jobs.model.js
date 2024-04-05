const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobname: String,
    client: String,
    location: String,
    startDate: Date,
    endDate: Date,
    travelDays: Number,
    isRTW: {type:Boolean, default: false},
});

//Pre-save hook to set isRTW to "true"
jobSchema.pre('save', function(next){
    this.isRTW = rtwStates.includes(this.location);
    next();
});

