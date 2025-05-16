// admin 데이터베이스로 전환
db = db.getSiblingDB('admin');

// admin 사용자 생성
db.createUser({
  user: "admin",
  pwd: "password",
  roles: [ { role: "root", db: "admin" } ]
});

// // auth_user 생성 (admin 데이터베이스에서)
// db.createUser({
//   user: "auth_user",
//   pwd: "auth_password",
//   roles: [
//     { role: "readWrite", db: "auth" },
//     { role: "dbAdmin", db: "auth" }
//   ]
// });

// // events_user 생성 (admin 데이터베이스에서)
// db.createUser({
//   user: "events_user",
//   pwd: "events_password",
//   roles: [
//     { role: "readWrite", db: "events" },
//     { role: "dbAdmin", db: "events" }
//   ]
// }); 