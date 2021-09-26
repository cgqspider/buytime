import mysql from 'mysql';

export default {
  //Function to get all the orders
  getOrder: function (con, callback) {
    con.query("SELECT * FROM tborders", callback);
  },


  //Function to get product by Id
  getById: function (con, id, callback) {
    con.query(`SELECT * FROM tborders WHERE orderid = ${id}`, callback)
  },

  //Function to create a product  
  create: function (con, data, filePath, callback) {

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
    con.query(`DELETE FROM tborders WHERE orderid = ${id}`, callback)
  }
}