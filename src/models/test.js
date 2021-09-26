import mysql from 'mysql';

export default {
    get: function(con, callback) {
      con.query("SELECT * FROM customers", callback);
    },

    destroy: function(con, id, callback) {
      con.query(`DELETE FROM biodata WHERE id_biodata = ${id}`, callback)
    }
  }