﻿# Event Reward System

이 프로젝트는 NestJS 기반의 MSA 아키텍처로 구현된 이벤트 보상 시스템입니다.

## 기술 스택

- Node.js 18
- NestJS
- MongoDB
- JWT 인증
- Docker + Docker Compose

## 시스템 구성

### Gateway Server (Port: 3000)
- 모든 API 요청의 진입점
- 인증 및 권한 검사
- 요청 라우팅

### Auth Server (Port: 3001)
- 유저 정보 관리
- 로그인 처리
- 역할 관리
- JWT 발급

### Event Server (Port: 3002)
- 이벤트 생성 및 관리
- 보상 정의
- 보상 요청 처리
- 지급 상태 관리

## 실행 방법

1. Docker와 Docker Compose가 설치되어 있어야 합니다.

2. 프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:
```bash
docker-compose up --build
```

2-1 mongodb UnHealthy 상태가 발생하면 down 후 다시 실행합니다.
```
[+] Running 6/6
 ...
 ✘ Container nexontest-mongodb-1         Error
 ...                                                                                           
dependency failed to start: container nexontest-mongodb-1 is unhealthy
```
2-2 기본 사용자 데이터가 추가됩니다.
mongodb와 auth-serve가 실행되면, seed 스크립트가 실행되어
기본 user 데이터(ADMIN, USER, OPERATOR, ADUITOR)가 생성됩니다.

3. 서비스가 정상적으로 실행되면 다음 URL로 접근할 수 있습니다:

[Http 통신]
- Gateway Server: http://localhost:3000
- Auth Server: http://localhost:4001
- Event Server: http://localhost:4002

[TCP 통신]
- Auth Server: http://localhost:3001
- Event Server: http://localhost:3002

## API 문서

각 서버의 API 문서는 다음 URL에서 확인할 수 있습니다:
- Gateway Server: http://localhost:3000/api
- Auth Server: http://localhost:4001/api
- Event Server: http://localhost:4002/api


## MongoDB Inital Structure
```
MongoDB
├── admin (시스템 데이터베이스)
│   └── users
│       └── admin
│           ├── user: "admin"
│           ├── pwd: "password"
│           └── roles: [{ role: "root", db: "admin" }]
│
├── auth (인증 서비스 데이터베이스)
│   └── collections
│       └── users
│           ├── _id: ObjectId
│           ├── email: String (unique)
│           ├── username: String (unique)
│           ├── password: String (hashed)
│           ├── role: Enum (USER, OPERATOR, AUDITOR, ADMIN)
│           ├── isActive: Boolean
│           ├── createdAt: Date
│           └── updatedAt: Date
│
└── events (이벤트 서비스 데이터베이스)
    └── collections
        ├── events
        │   ├── _id: ObjectId
        │   ├── name: String
        │   ├── description: String
        │   ├── type: Enum (LOGIN, INVITE, CUSTOM)
        │   ├── status: Enum (ACTIVE, INACTIVE)
        │   ├── startDate: Date
        │   ├── endDate: Date
        │   ├── needApproval: Boolean
        │   ├── conditions: Object
        │   ├── rewards: [ObjectId]
        │   ├── createdAt: Date
        │   └── updatedAt: Date
        │
        ├── rewards
        │   ├── _id: ObjectId
        │   ├── category: Enum (POINTS, ITEM, COUPON, CURRENCY, EXPERIENCE)
        │   ├── subType: String
        │   ├── name: String
        │   ├── description: String
        │   ├── imageUrl: String (optional)
        │   ├── metadata: Object
        │   ├── eventId: ObjectId (ref: 'events')
        │   ├── createdAt: Date
        │   └── updatedAt: Date
        │
        └── rewardrequests
            ├── _id: ObjectId
            ├── userId: ObjectId (ref: 'auth.users')
            ├── eventId: ObjectId (ref: 'events')
            ├── status: Enum (PENDING, APPROVED, REJECTED)
            ├── history: [{
            │   ├── requestAt: Date
            │   ├── status: Enum (PENDING, APPROVED, REJECTED)
            │   └── conditionStatus: {
            │       ├── [key]: {
            │       │   ├── required: any
            │       │   ├── actual: any
            │       │   └── isMet: Boolean
            │       │   }
            │       └── ...
            │   }
            │ }]
            ├── approvedData: {
            │   ├── approvedAt: Date
            │   └── approvedBy: ObjectId (ref: 'auth.users') | null
            │ }
            ├── rejectedData: {
            │   ├── rejectedAt: Date
            │   ├── rejectedBy: ObjectId (ref: 'auth.users') | null
            │   └── rejectionReason: String
            │ }
            ├── createdAt: Date
            └── updatedAt: Date
```
