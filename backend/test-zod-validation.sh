#!/bin/bash

echo "=== Zod Validation Tests ==="
echo ""

SERVER_URL="http://localhost:5000"

echo "1. Testing invalid limit parameter (should fail validation):"
curl -s "$SERVER_URL/api/news/global?limit=invalid" | head -n 3
echo ""

echo "2. Testing valid limit parameter (should work):"
curl -s "$SERVER_URL/api/news/global?limit=10" | head -n 3  
echo ""

echo "3. Testing invalid country parameter (should fail validation):"
curl -s "$SERVER_URL/api/news/country/123?limit=10" | head -n 3
echo ""

echo "4. Testing valid country parameter (should work):"
curl -s "$SERVER_URL/api/news/country/USA?limit=10" | head -n 3
echo ""

echo "5. Testing invalid MongoDB ObjectId (should fail validation):"
curl -s "$SERVER_URL/api/news/v1/events/invalid-id/notes" | head -n 3
echo ""

echo "6. Testing valid MongoDB ObjectId format (should work):"
curl -s "$SERVER_URL/api/news/v1/events/507f1f77bcf86cd799439011/notes" | head -n 3
echo ""

echo "=== Test Complete ==="
