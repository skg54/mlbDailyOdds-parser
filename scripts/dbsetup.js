var mysql    = require('mysql2');

var dbconfig = require('../config/database');

// Script for setting up database and tables
var conn = mysql.createConnection(dbconfig.connection);

conn.query('CREATE DATABASE ' + dbconfig.database);

// Set up DB Tables
conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`Parent` ( \
    `id` CHAR(36) NOT NULL PRIMARY KEY, \
    `email` VARCHAR(255) NOT NULL, \
    `firstName` VARCHAR(255) NOT NULL, \
    `lastName` VARCHAR(255) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `passwordPlain` CHAR(60) NOT NULL, \
    `phoneNumber` VARCHAR(60) NOT NULL, \
    `phoneNumberConfirmed` BOOLEAN NOT NULL DEFAULT 0, \
    `emailConfirmed` BOOLEAN NOT NULL DEFAULT 0, \
    `scoutAccountCreated` BOOLEAN NOT NULL DEFAULT 0, \
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP \
  )');

// Set up DB Tables
conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`EmailAuth` ( \
    `parentId` CHAR(36) NOT NULL PRIMARY KEY, \
    `email` VARCHAR(255) NOT NULL, \
    `token` VARCHAR(255) NOT NULL, \
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
    FOREIGN KEY fk_Email_Auth(parentId) REFERENCES Parent(id) ON DELETE RESTRICT \
  )');

conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`Child` ( \
    `id` CHAR(36) NOT NULL PRIMARY KEY, \
    `firstName` VARCHAR(255) NOT NULL, \
    `lastName` VARCHAR(255) NOT NULL, \
    `schoolDistrict` VARCHAR(255) NOT NULL, \
    `schoolDistrictID` CHAR(36) NOT NULL, \
    `parentId` CHAR(36) NOT NULL \
  )');

conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`Route` ( \
    `routeId` CHAR(36) NOT NULL PRIMARY KEY, \
    `parentId` CHAR(36) NOT NULL, \
    FOREIGN KEY fk_Route_Child_ChildId(routeId) REFERENCES Child(id) ON DELETE RESTRICT \
  )');

conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`ParentChild` ( \
    `parentId` CHAR(36) NOT NULL PRIMARY KEY, \
    `childId` CHAR(36) NOT NULL, \
    FOREIGN KEY fk_ParentChild_Parent_ChildId(childId) REFERENCES Parent(id) ON DELETE CASCADE, \
    FOREIGN KEY fk_ParentChild_Child_ParentId(parentId) REFERENCES Child(id) ON DELETE CASCADE \
  )');

conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`Bus` ( \
    `busId` CHAR(36) NOT NULL PRIMARY KEY, \
    `busNum` CHAR(36) NOT NULL, \
    `routeId` CHAR(36) NOT NULL, \
    FOREIGN KEY fk_Bus_Route_RouteId(routeId) REFERENCES Route(routeId) ON DELETE RESTRICT \
  )');

conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`ChildRoute` ( \
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, \
    `routeId` CHAR(36) NOT NULL, \
    `routeName` VARCHAR(255) NOT NULL, \
    `parentId` CHAR(36) NOT NULL, \
    `schoolDistrict` VARCHAR(255) NOT NULL, \
    `schoolDistrictID` CHAR(36) NOT NULL \
  )');

conn.query('\
  CREATE TABLE `' + dbconfig.database + '`.`BusRoute` ( \
    `busId` CHAR(36) NOT NULL PRIMARY KEY, \
    `routeId` CHAR(36) NOT NULL, \
    FOREIGN KEY fk_BusRoute_Route_BusId(busId) REFERENCES Route(routeId) ON DELETE CASCADE, \
    FOREIGN KEY fk_BusRoute_Bus_RouteId(routeId) REFERENCES Bus(busId) ON DELETE CASCADE \
  )');

console.log('Success! Database created.');
conn.end();
