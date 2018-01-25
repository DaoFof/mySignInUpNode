var mongoose =  require('mongoose');

//mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/SignInUp");

// mongoose.connection.on('open', function() {
//   mongoose.connection.db.admin().serverStatus(function(error, info) {
//     console.log(info.version);
//   });
// });

module.exports = {mongoose};
