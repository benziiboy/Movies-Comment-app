const mongoose = require('mongoose') 

const referenceSchema =  new mongoose.Schema (
    {
       
        username:{
            type: String,
            required: true,
            lowercase: true
        },

        reference:{ 
            type: String,
            required: true,
            maxLength:500

        }
    })

module.exports = mongoose.model ('Reference', referenceSchema)

