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

    var sql = 'SELECT * FROM episodes_guests eg WHERE eg.episode_id = ' + event.episode_id + ' ORDER BY t.last_name ASC';
    connection.query(sql, function (error, results, fields) {
    callback( null, results );
  });
});