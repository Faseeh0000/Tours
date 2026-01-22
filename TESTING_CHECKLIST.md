# API Testing Checklist for Evaluation

Use this checklist to systematically test all API endpoints during your evaluation.

## Prerequisites
- [ ] Server is running (`npm start`)
- [ ] Database is seeded (`node Seed/seed.js`)
- [ ] Postman/Thunder Client/curl is ready
- [ ] Swagger UI is accessible at `http://localhost:4000/api-docs`

## Test Credentials (from seeder)
- **Admin**: `admin@tours.com` / `admin123`
- **Guide**: `guide@tours.com` / `guide123`
- **User**: `user@tours.com` / `user123`

---

## 1. Authentication Endpoints

### ✅ Signup
- [ ] POST `/signup` with valid data
- [ ] POST `/signup` with invalid email (should fail)
- [ ] POST `/signup` with mismatched passwords (should fail)
- [ ] POST `/signup` with missing required fields (should fail)

### ✅ Verify OTP
- [ ] POST `/verify-otp` with correct OTP (check email)
- [ ] POST `/verify-otp` with wrong OTP (should fail)
- [ ] POST `/verify-otp` with expired OTP (should fail)

### ✅ Login
- [ ] POST `/login` with valid credentials
- [ ] POST `/login` with wrong password (should fail)
- [ ] POST `/login` with unverified account (should fail)
- [ ] **Save the token** for protected routes

### ✅ Forgot Password
- [ ] POST `/forget` with valid email
- [ ] POST `/forget` with invalid email (should fail)
- [ ] Check email for reset token

### ✅ Reset Password
- [ ] POST `/reset/{token}` with valid token and matching passwords
- [ ] POST `/reset/{token}` with mismatched passwords (should fail)
- [ ] POST `/reset/{token}` with expired token (should fail)

---

## 2. Tour Endpoints (Public)

### ✅ Get All Tours
- [ ] GET `/api/v1/tours` - should return 3 tours
- [ ] GET `/api/v1/tours?limit=2` - test query parameters
- [ ] GET `/api/v1/tours?sort=price` - test sorting

### ✅ Get Tour by ID
- [ ] GET `/api/v1/tours/{tourId}` - use ID from seeder
- [ ] GET `/api/v1/tours/invalid-id` - should return 404

### ✅ Get Tour by Name
- [ ] GET `/api/v1/tours/name/Hunza Valley`
- [ ] GET `/api/v1/tours/name/NonExistent` - should return 404

### ✅ Get Cheapest Tours
- [ ] GET `/api/v1/tours/cheap` - should return limited results

### ✅ Get Tour Statistics
- [ ] GET `/api/v1/tours/stats` - should return statistics

### ✅ Get Monthly Plan
- [ ] GET `/api/v1/tours/plan` - should return monthly plan

---

## 3. Tour Endpoints (Protected)

### ✅ Create Tour
- [ ] POST `/api/v1/tours` **without token** (should fail - 401)
- [ ] POST `/api/v1/tours` **with token** - valid data
- [ ] POST `/api/v1/tours` **with token** - invalid data (should fail)
- [ ] POST `/api/v1/tours` **with token** - missing required fields (should fail)

### ✅ Update Tour
- [ ] PATCH `/api/v1/tours/{tourId}` **without token** (should fail - 401)
- [ ] PATCH `/api/v1/tours/{tourId}` **with token** - valid update
- [ ] PATCH `/api/v1/tours/{tourId}` **with token** - invalid data (should fail)

### ✅ Delete Tour
- [ ] DELETE `/api/v1/tours/{tourId}` **without token** (should fail - 401)
- [ ] DELETE `/api/v1/tours/{tourId}` **with token** - should delete

---

## 4. User Endpoints (Protected)

### ✅ Get All Users (Admin Only)
- [ ] GET `/users` **without token** (should fail - 401)
- [ ] GET `/users` **with user token** (should fail - 403)
- [ ] GET `/users` **with admin token** - should return users

### ✅ Update Own Profile
- [ ] PATCH `/users/me` **without token** (should fail - 401)
- [ ] PATCH `/users/me` **with token** - update name
- [ ] PATCH `/users/me` **with token** - update email
- [ ] PATCH `/users/me` **with token** - try to update password (should fail)

### ✅ Update Password
- [ ] PATCH `/users/update-password` **without token** (should fail - 401)
- [ ] PATCH `/users/update-password` **with token** - correct current password
- [ ] PATCH `/users/update-password` **with token** - wrong current password (should fail)
- [ ] PATCH `/users/update-password` **with token** - mismatched new passwords (should fail)

### ✅ Admin Update User
- [ ] PATCH `/users/{userId}` **with user token** (should fail - 403)
- [ ] PATCH `/users/{userId}` **with admin token** - update role
- [ ] PATCH `/users/{userId}` **with admin token** - update name and email

### ✅ Delete User (Admin Only)
- [ ] DELETE `/users/{userId}` **with user token** (should fail - 403)
- [ ] DELETE `/users/{userId}` **with admin token** - should delete

---

## 5. Booking Endpoints

### ✅ Create Booking
- [ ] POST `/bookings` **without token** (should fail - 401)
- [ ] POST `/bookings` **with token** - valid tour ID
- [ ] POST `/bookings` **with token** - invalid tour ID (should fail)
- [ ] POST `/bookings` **with token** - missing required fields (should fail)

---

## 6. Review Endpoints

### ✅ Create Review
- [ ] POST `/reviews` **without token** (should fail - 401)
- [ ] POST `/reviews` **with token** - valid data
- [ ] POST `/reviews` **with token** - rating > 5 (should fail)
- [ ] POST `/reviews` **with token** - rating < 1 (should fail)
- [ ] POST `/reviews` **with token** - duplicate review for same tour (should fail - unique constraint)

---

## 7. Validation Testing

### ✅ Zod Validation
- [ ] Test all endpoints with invalid data types
- [ ] Test all endpoints with missing required fields
- [ ] Test all endpoints with out-of-range values
- [ ] Verify error messages are clear and helpful

---

## 8. Security Testing

### ✅ Authentication
- [ ] Access protected routes without token → 401
- [ ] Access protected routes with invalid token → 401
- [ ] Access protected routes with expired token → 401

### ✅ Authorization
- [ ] Access admin routes with user token → 403
- [ ] Access admin routes with guide token → 403
- [ ] Access admin routes with admin token → 200

### ✅ Rate Limiting
- [ ] Make 100+ requests quickly → should be rate limited

---

## 9. Error Handling

### ✅ Test Error Responses
- [ ] 400 - Bad Request (validation errors)
- [ ] 401 - Unauthorized (no/invalid token)
- [ ] 403 - Forbidden (insufficient permissions)
- [ ] 404 - Not Found (invalid IDs)
- [ ] 500 - Server Error (if applicable)

---

## 10. Swagger Documentation

### ✅ Verify Swagger UI
- [ ] All endpoints are documented
- [ ] Request/response schemas are correct
- [ ] Authentication works in Swagger UI
- [ ] Can test endpoints from Swagger UI

---

## Quick Test Script

### Using curl (replace {token} with actual token):

```bash
# Login
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@tours.com","pass":"user123"}'

# Get Tours (no auth needed)
curl http://localhost:4000/api/v1/tours

# Create Booking (needs token)
curl -X POST http://localhost:4000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"tour":"{tourId}","price":500}'
```

---

## Evaluation Tips

1. **Start with Public Endpoints**: Test tours endpoints first (no auth needed)
2. **Get Authentication Token**: Login and save token
3. **Test Protected Routes**: Use saved token for authenticated endpoints
4. **Test Error Cases**: Don't just test success cases
5. **Use Swagger UI**: It's the easiest way to test and demonstrate
6. **Show Validation**: Demonstrate Zod validation working
7. **Show Security**: Demonstrate authentication and authorization
8. **Document Issues**: Note any bugs or improvements needed

---

## Expected Results Summary

- ✅ All public endpoints return data
- ✅ All protected endpoints require authentication
- ✅ Admin-only endpoints require admin role
- ✅ Validation works on all endpoints
- ✅ Error messages are clear
- ✅ Swagger documentation is complete

Good luck with your evaluation! 🚀
