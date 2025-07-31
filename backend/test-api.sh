#!/bin/bash

# iPray API Test Script
# This script tests the core functionality of the iPray backend

echo "=== iPray API Test Suite ==="
echo

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s -X GET http://localhost:5000/api/health | jq '.'
echo -e "\n"

# Test 2: User Registration
echo "2. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "TestPassword123!"
  }')
echo $REGISTER_RESPONSE | jq '.'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo -e "\n"

# Test 3: User Login
echo "3. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "TestPassword123!"
  }')
echo $LOGIN_RESPONSE | jq '.'
echo -e "\n"

# Test 4: Protected Route - Get Profile
echo "4. Testing Protected Route - Get Profile..."
curl -s -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# Test 5: Input Validation
echo "5. Testing Input Validation (should fail)..."
curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ab",
    "email": "invalid-email",
    "password": "weak"
  }' | jq '.'
echo -e "\n"

# Test 6: Unauthorized Access
echo "6. Testing Unauthorized Access (should fail)..."
curl -s -X GET http://localhost:5000/api/user/profile | jq '.'
echo -e "\n"

echo "=== Test Suite Complete ==="
