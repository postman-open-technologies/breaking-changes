const vandium = require('vandium');
const mysql  = require('mysql');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });

    var sql = 'DELETE FROM episodes_guests WHERE episode_id = ' + event.episode_id + ' AND guest_id = ' + event.guest_id;
    connection.query(sql, function (error, results, fields) {

    callback( null );

  });
});