const mongoose = require('mongoose')

const connectToDatabase = (url)=>{
    mongoose.connect(url).then(()=>{
        console.log('Database Connected')
    }).catch((err)=>{
        console.log('Unable to Connect to database: ', err.message);
        process.exit(1)
    })
}

module.exports = connectToDatabase