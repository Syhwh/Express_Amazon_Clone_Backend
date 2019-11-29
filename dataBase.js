const mongoose = require('mongoose');
const config = require('./config')

    mongoose.connect (config.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser:true,
//useFindAndModify:false

    })

.then(db=> console.log('DB is connected'))
.catch(err=>console.log(err))