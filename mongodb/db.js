'use strict';
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/house", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log(
        '连接数据库成功'
    );
})

db.on('error', function(error) {
    console.log(
        'Error in MongoDb connection: ' + error
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
        '数据库断开，重新连接数据库'
    );
    mongoose.connect("mongodb://localhost/house");
});


module.exports = db;