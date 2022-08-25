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

    var sql = 'INSERT INTO episodes_clips(episode_id,';

    var total_properties = Object.keys(event.body).length;
    
    var property_count = 1;
    for (const [key, value] of Object.entries(event.body)) {
      sql += key;
      if(property_count != total_properties){
        sql += ',';
      }
      property_count++;
    }
      
    sql += ')';

    sql += ' VALUES(' + connection.escape(event.episode_id) + ',';
    
    var property_count = 1;
    for (const [key, value] of Object.entries(event.body)) {
      sql += connection.escape(value);
      if(property_count != total_properties){
        sql += ',';
      }
      property_count++;
    }

    sql += ")";
  
    connection.query(sql, function (error, results, fields) {
  

      callback( null, results );

    });
});