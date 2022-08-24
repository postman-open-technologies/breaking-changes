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


    connection.connect(function(err) {
      if (err) throw err;

      var sql = "SELECT * FROM episodes_segments WHERE episode_id = " + event.episode_id + " and segment_id = " + event.body.segment_id + " LIMIT 1";
      connection.query(sql, function (err, result, fields) {
        if(result.length > 0){
          callback( null, result[0] ); 
        }
        else{

          var sql = "INSERT INTO episodes_segments(episode_id,segment_id) VALUES(" + event.episode_id + ", " + event.body.segment_id + ")";
        
          connection.query(sql, function (error, results, fields) {
        
            var inserted = {};
            inserted.id = results.insertId;
            inserted.episode_id = event.episode_id;
            inserted.segment_id = event.segment_id;
        
            callback( null, inserted );
      
          });          

        }
      });
    });

});