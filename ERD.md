# 쇼핑몰 데이터베이스 ERD

이 문서는 프로젝트의 데이터베이스 스키마 구조를 시각화한 ERD(Entity Relationship Diagram)입니다.

```mermaid
erDiagram
    %% User and Auth
    User ||--o{ Order : "주문 (1:N)"
    User ||--|| Cart : "장바구니 (1:1)"
    
    %% Product and Category
    Category ||--o{ Product : "포함 (1:N)"
    
    %% Cart System
    Cart ||--o{ CartItem : "포함 (1:N)"
    Product ||--o{ CartItem : "담김 (1:N)"
    
    %% Order System
    Order ||--o{ OrderItem : "포함 (1:N)"
    Product ||--o{ OrderItem : "주문됨 (1:N)"

    User {
        Int id PK
        String email "이메일 (Unique)"
        String name "이름"
        Role role "권한 (USER/ADMIN)"
        Provider provider "가입 경로 (GOOGLE/NAVER)"
        String snsId "소셜 고유 ID"
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        Int id PK
        String name "상품명"
        String description "설명"
        Int price "가격"
        Int stock "재고"
        String[] images "이미지 URL 목록"
        Int categoryId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Category {
        Int id PK
        String name "카테고리명"
    }

    Cart {
        Int id PK
        Int userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    CartItem {
        Int id PK
        Int cartId FK
        Int productId FK
        Int quantity "수량"
        DateTime createdAt
        DateTime updatedAt
    }

    Order {
        Int id PK
        Int userId FK
        Int total "총 결제금액"
        OrderStatus status "주문 상태"
        DateTime createdAt
        DateTime updatedAt
    }

    OrderItem {
        Int id PK
        Int orderId FK
        Int productId FK
        Int quantity "수량"
        Int price "구매 당시 가격"
    }
```

## Enum Types

### Role
- USER: 일반 사용자
- ADMIN: 관리자

### Provider
- GOOGLE: 구글 로그인
- NAVER: 네이버 로그인

### OrderStatus
- PENDING: 결제 대기
- PAID: 결제 완료
- SHIPPED: 배송 중
- DELIVERED: 배송 완료
- CANCELLED: 주문 취소
