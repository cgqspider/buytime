import mysql from 'mysql';

export default {
  //Function to get all the users
    get: function(con, callback) {
      con.query("SELECT * FROM tbusers", callback);
    },

    //Function to get users by Id
    getByEmail: function(con, email, callback) {
        con.query(`SELECT * FROM tbusers WHERE useremail = '${email}'`, callback)
      },
    
    //Function to create a user  
    create_user: function(con, data, callback) {
      console.log(data);
        con.query(`insert into tbusers(useremail,username,userpass) values('${data.email}','${data.name}','${data.password}')`,callback)
      },
    
    //Function to update a user  
    update: function(con, data, id, callback) {
        con.query(
          `UPDATE tbusers SET 
          useremail = '${data.useremail}', 
          username = '${data.username}',
          userpass = '${data.userpass}'
          WHERE userid = ${id}`,
          callback
        )
      },

    //Function to delete a user
    destroy: function(con, id, callback) {
      con.query(`DELETE FROM tbusers WHERE userid = ${id}`, callback)
    }
  }