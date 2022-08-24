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

    var sql = 'SELECT * FROM clips t INNER JOIN episodes_clips bt ON t.id = bt.clip_id WHERE bt.episode_id = ' + event.episode_id + ' ORDER BY t.Name';
    connection.query(sql, function (error, results, fields) {
    callback( null, results );
  });
});