import mysql from 'mysql';

export default {
 

  //Function to Whitelist a refresh token in DB  
  create: function (con, token, callback) {

    con.query(`insert into tbrefreshtoken(refreshtoken) values(${token})`, callback)
  },


  //Function to delete a refresh token in DB  
  destroy: function (con, token, callback) {
    con.query(`DELETE FROM tbrefreshtoken WHERE refreshtoken = ${token}`, callback)
  }
}