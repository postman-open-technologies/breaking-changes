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

        // See if we have a tag
          var sql1 = "SELECT * FROM blueprints.tags t WHERE name = '" + event.body.name + "'";
          connection.query(sql1, function (err, result1, fields) {
            if(result1.length > 0){
                
                var tag_id = result1[0].id;
                
                // See if we have episode tag
                var sql2 = "SELECT * FROM episodes_segments_tags WHERE episode_id = " + event.episode_id + " AND segment_id = " + event.segment_id + " AND tag_id = " + tag_id;
                console.log("sql2: " + sql2);
                connection.query(sql2, function (err, result2, fields) {
                  if(result2.length > 0){

                      var tag = {};
                      tag.stage = 1;
                      tag.id = tag_id;
                      tag.name = event.body.name;
                      
                      callback( null, tag ); 
                  }
                  else{      
                    
                    var sql3 = "INSERT INTO episodes_segments_tags(episode_id,segment_id,tag_id) VALUES(" + event.episode_id + "," + event.segment_id + "," + tag_id + ")";
              
                    connection.query(sql3, function (error, result3, fields) {                    
              
                        var tag = {};
                        tag.stage = 2;
                        tag.id = tag_id;
                        tag.name = event.body.name;
                        
                        callback( null, tag ); 
                    });

                  }
                });
            }
            else{
    
                var sql4 = "INSERT INTO blueprints.tags(name) VALUES('" + event.body.name + "')";
              
                connection.query(sql4, function (error, result4, fields) {

                    var tag_id = result4.insertId;
              
                    var sql5 = "INSERT INTO episodes_segments_tags(episode_id,segment_id) VALUES('" + event.episode_id + "','" + event.segment_id + "')";
              
                    connection.query(sql5, function (error, result5, fields) {
                  
                      var tag = {};
                      tag.stage = 3;
                      tag.id = tag_id;
                      tag.name = event.body.name;
                  
                      callback( null, tag );
                
                    }); 
            
                });          
      
              }
            });        

    });

});