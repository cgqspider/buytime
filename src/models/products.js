import mysql from 'mysql';

export default {
  //Function to get all the product
  get: function (con, callback) {
    con.query("SELECT * FROM tbproducts", callback);
  },

  getCart: function (con,pids ,callback) {
    var query=`SELECT * FROM tbproducts where pid in (?)`;
    console.log(pids);
    con.query(query,pids, callback);
  },

  //Function to get product by Id
  getById: function (con, id, callback) {
    con.query(`SELECT * FROM tbproducts WHERE pid = ${id}`, callback)
  },

  //Function to create a product  
  create_user: function (con, data, filePath, callback) {

    con.query(`insert into tbproducts(pname,psize,pimage) values('${data.name}','${data.size}','${filePath}')`, callback)
  },

  //Function to update a product  
  update: function (con, data, id, path, callback) {
    //If Path is there then create query for file upload
    let qry = '';

    if (path != null) {
      qry = `UPDATE tbproducts SET pname = '${data.name}', psize = '${data.size}',pimage = '${path}' WHERE pid = ${id}`;

    }
    else {
      qry = `UPDATE tbproducts SET pname = '${data.name}', psize = '${data.size}' WHERE pid = ${id}`;
    }
    con.query(qry,
      callback
    )
  },

  //Function to delete a product
  destroy: function (con, id, callback) {
    con.query(`DELETE FROM tbproducts WHERE pid = ${id}`, callback)
  }
}