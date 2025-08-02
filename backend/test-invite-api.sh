#!/bin/bash

# Test script for User Invite API
BASE_URL="http://localhost:5000/api"

echo "🧪 Testing User Invite API..."
echo "================================="

# First, try to login with existing user
echo "1. Trying to login with existing user..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser2@example.com",
    "password": "TestPass123!"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')
echo "   Login Token: $TOKEN"

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get authentication token"
  echo "Login Response: $LOGIN_RESPONSE"
  exit 1
fi

echo ""
echo "2. Testing invitation send..."

# Test sending an invitation
INVITE_RESPONSE=$(curl -s -X POST "$BASE_URL/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "recipientEmail": "invitee@example.com",
    "message": "Join us on our prayer platform!"
  }')

echo "   Response: $INVITE_RESPONSE"

# Check if invitation was successful
INVITE_ID=$(echo $INVITE_RESPONSE | jq -r '.data.invitation.id // empty')
EMAIL_PREVIEW=$(echo $INVITE_RESPONSE | jq -r '.data.emailPreview // empty')

if [ ! -z "$INVITE_ID" ] && [ "$INVITE_ID" != "null" ]; then
  echo "✅ Invitation sent successfully!"
  echo "   Invitation ID: $INVITE_ID"
  echo "   Email Preview: $EMAIL_PREVIEW"
else
  echo "❌ Failed to send invitation"
  echo "Response: $INVITE_RESPONSE"
fi

echo ""
echo "3. Testing get sent invitations..."

# Test getting sent invitations
SENT_INVITES_RESPONSE=$(curl -s -X GET "$BASE_URL/users/invites/sent" \
  -H "Authorization: Bearer $TOKEN")

echo "   Response: $SENT_INVITES_RESPONSE"

echo ""
echo "4. Testing duplicate invitation (should fail)..."

# Test sending duplicate invitation (should fail)
DUPLICATE_RESPONSE=$(curl -s -X POST "$BASE_URL/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "recipientEmail": "invitee@example.com",
    "message": "Another invitation"
  }')

echo "   Response: $DUPLICATE_RESPONSE"

# Check if it properly rejected duplicate
if echo $DUPLICATE_RESPONSE | grep -q "already sent"; then
  echo "✅ Duplicate invitation correctly rejected"
else
  echo "❌ Duplicate invitation should have been rejected"
fi

echo ""
echo "5. Testing invitation to existing user (should fail)..."

# Test sending invitation to existing user (should fail)
EXISTING_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "recipientEmail": "testuser@example.com",
    "message": "Join us!"
  }')

echo "   Response: $EXISTING_USER_RESPONSE"

# Check if it properly rejected existing user
if echo $EXISTING_USER_RESPONSE | grep -q "already exists"; then
  echo "✅ Invitation to existing user correctly rejected"
else
  echo "❌ Invitation to existing user should have been rejected"
fi

echo ""
echo "🎉 User Invite API tests completed!"
