select * from tbusers

CREATE TABLE tbusers (
    userid int not NULL  AUTO_INCREMENT,
    useremail varchar(255) not null
    username varchar(255) not null,
    userpass varchar(255) not null,
    userrole varchar(255) not null default 'customer'
PRIMARY KEY (userid)
);

CREATE TABLE tborders (
    orderid int not NULL  AUTO_INCREMENT,
    ouserid int not null,
    phone varchar(255) not null,
    address varchar(255) not null,
    paymenttype varchar(255) not null,
    status varchar(255) not null default 'order_placed',
PRIMARY KEY (orderid),
FOREIGN KEY (ouserid) REFERENCES tbusers(userid)
);

CREATE TABLE tbrefreshtoken (
    tid int not NULL AUTO_INCREMENT,
    refreshtoken varchar(500) not null,
  
PRIMARY KEY (tid)
);

insert into tbusers(useremail,username,userpass ) values('rani@gmail.com','Rani','Indiacan420')




insert into tborders(ouserid, phone, address, paymenttype) values(18,'789989876','ropar','MasterCard')