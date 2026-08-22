# Clothing E-Commerce API — Postman Reference

Base URL: `http://localhost:5000`

> Set a Postman environment variable `{{BASE_URL}} = http://localhost:5000`  
> After login, save the returned `token` as `{{TOKEN}}` and use it in all protected requests as:  
> **Authorization:** `Bearer {{TOKEN}}`

---

## 1. Auth

### Register a new user
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "_id": "64abc...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer",
    "token": "<jwt_token>"
  }
}
```

---

### Login
```
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}
```

---

### Get My Profile *(Protected)*
```
GET {{BASE_URL}}/api/auth/me
Authorization: Bearer {{TOKEN}}
```

---

### Update My Profile *(Protected)*
```
PUT {{BASE_URL}}/api/auth/me
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Jane Smith",
  "phone": "9123456789",
  "address": {
    "street": "42 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "postalCode": "560001",
    "country": "India"
  }
}
```

---

## 2. Products

### Get All Products *(Public)*
```
GET {{BASE_URL}}/api/products
```

**With Filters & Pagination:**
```
GET {{BASE_URL}}/api/products?category=women&minPrice=500&maxPrice=2000&keyword=dress&sort=price_asc&page=1&limit=10
```

Query Parameters:

| Parameter  | Type   | Description                                  |
|------------|--------|----------------------------------------------|
| `keyword`  | string | Search in name, description, brand           |
| `category` | string | One of: men, women, kids, accessories, etc.  |
| `minPrice` | number | Minimum price filter                         |
| `maxPrice` | number | Maximum price filter                         |
| `sort`     | string | `price_asc`, `price_desc`, `rating`, or blank (newest) |
| `page`     | number | Page number (default: 1)                     |
| `limit`    | number | Items per page (default: 10, max: 50)        |

---

### Get Single Product *(Public)*
```
GET {{BASE_URL}}/api/products/64abc123def456
```

---

### Create Product *(Admin Only)*
```
POST {{BASE_URL}}/api/products
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Women's Floral Kurta",
  "description": "Beautiful floral print kurta made from 100% cotton.",
  "price": 1299,
  "discountPrice": 999,
  "category": "women",
  "brand": "FabIndia",
  "images": [
    { "url": "https://example.com/images/kurta1.jpg", "altText": "Kurta Front View" }
  ],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Blue", "Pink"],
  "countInStock": 150,
  "isFeatured": true
}
```

---

### Update Product *(Admin Only)*
```
PUT {{BASE_URL}}/api/products/64abc123def456
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "price": 1199,
  "countInStock": 200
}
```

---

### Delete Product *(Admin Only — Soft Delete)*
```
DELETE {{BASE_URL}}/api/products/64abc123def456
Authorization: Bearer {{TOKEN}}
```

---

## 3. Cart

### Get Cart *(Protected)*
```
GET {{BASE_URL}}/api/cart
Authorization: Bearer {{TOKEN}}
```

---

### Add Item to Cart *(Protected)*
```
POST {{BASE_URL}}/api/cart
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "productId": "64abc123def456",
  "quantity": 2,
  "size": "M",
  "color": "Blue"
}
```

---

### Remove Cart Item *(Protected)*
```
DELETE {{BASE_URL}}/api/cart/64itemSubdocumentId
Authorization: Bearer {{TOKEN}}
```
> `itemId` is the `_id` of the cart item subdocument (returned in GET cart response).

---

### Clear Cart *(Protected)*
```
DELETE {{BASE_URL}}/api/cart
Authorization: Bearer {{TOKEN}}
```

---

## 4. Orders

### Create Order *(Protected)*
```
POST {{BASE_URL}}/api/orders
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "64abc123def456",
      "name": "Women's Floral Kurta",
      "quantity": 1,
      "size": "M",
      "color": "Blue"
    }
  ],
  "shippingAddress": {
    "street": "42 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "postalCode": "560001",
    "country": "India"
  },
  "paymentMethod": "UPI",
  "notes": "Please pack carefully."
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": {
    "_id": "64order...",
    "status": "pending",
    "itemsPrice": 999,
    "taxPrice": 179.82,
    "shippingPrice": 0,
    "totalPrice": 1178.82
  }
}
```

---

### Get My Orders *(Protected)*
```
GET {{BASE_URL}}/api/orders/my
Authorization: Bearer {{TOKEN}}
```

---

### Get Order by ID *(Protected)*
```
GET {{BASE_URL}}/api/orders/64order123abc
Authorization: Bearer {{TOKEN}}
```

---

### Get All Orders *(Admin Only)*
```
GET {{BASE_URL}}/api/orders
Authorization: Bearer {{TOKEN}}
```

**With Filters:**
```
GET {{BASE_URL}}/api/orders?status=pending&page=1&limit=20
```

Status options: `pending`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`

---

### Update Order Status *(Admin Only)*
```
PUT {{BASE_URL}}/api/orders/64order123abc/status
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "DHL123456789"
}
```

---

## HTTP Status Codes Used

| Code | Meaning                        |
|------|-------------------------------|
| 200  | OK                             |
| 201  | Created                        |
| 400  | Bad Request                    |
| 401  | Unauthorized (no/invalid JWT)  |
| 403  | Forbidden (insufficient role)  |
| 404  | Not Found                      |
| 409  | Conflict (e.g., duplicate email) |
| 422  | Unprocessable Entity (validation) |
| 500  | Internal Server Error          |
