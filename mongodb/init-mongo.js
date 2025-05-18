// admin 데이터베이스로 전환
db = db.getSiblingDB('admin');

// admin 사용자 생성
db.createUser({
  user: "admin",
  pwd: "password",
  roles: [ { role: "root", db: "admin" } ]
});