#!/bin/bash

# Test Light API Routes
echo "=== AYA Light API Test ==="
echo

# Base URL for API
API_URL="http://localhost:5000/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing Light API endpoints...${NC}"
echo

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
curl -s -X GET ${API_URL}/health | jq '.'
echo -e "\n"

# Test 2: Get all lights (should work without auth)
echo -e "${YELLOW}2. Testing Get All Lights (public)...${NC}"
curl -s -X GET ${API_URL}/lights | jq '.'
echo -e "\n"

# Test 3: Try to create light without authentication (should fail)
echo -e "${YELLOW}3. Testing Create Light without auth (should fail)...${NC}"
curl -s -X POST ${API_URL}/lights \
  -H "Content-Type: application/json" \
  -d '{"location": "New York, USA", "title": "Test Light"}' | jq '.'
echo -e "\n"

# Test 4: Register a test user for authentication
echo -e "${YELLOW}4. Registering test user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST ${API_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lighttest@example.com",
    "password": "TestPass123!",
    "name": "Light Test User"
  }')

echo $REGISTER_RESPONSE | jq '.'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token // .data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}Failed to get token from registration. Trying login...${NC}"
  
  # Try to login instead
  LOGIN_RESPONSE=$(curl -s -X POST ${API_URL}/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "lighttest@example.com",
      "password": "TestPass123!"
    }')
  
  echo $LOGIN_RESPONSE | jq '.'
  TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // .data.token // empty')
fi

echo -e "\n"

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}Authentication successful! Token: ${TOKEN:0:20}...${NC}"
  echo -e "\n"
  
  # Test 5: Create a light with authentication
  echo -e "${YELLOW}5. Testing Create Light with auth...${NC}"
  CREATE_RESPONSE=$(curl -s -X POST ${API_URL}/lights \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "location": "San Francisco, CA, USA",
      "title": "Prayer for World Peace",
      "description": "Lighting a candle for peace and healing around the world",
      "isAnonymous": false
    }')
  
  echo $CREATE_RESPONSE | jq '.'
  LIGHT_ID=$(echo $CREATE_RESPONSE | jq -r '.data.lightId // .data.light._id // empty')
  echo -e "\n"
  
  if [ -n "$LIGHT_ID" ] && [ "$LIGHT_ID" != "null" ]; then
    echo -e "${GREEN}Light created successfully! ID: $LIGHT_ID${NC}"
    echo -e "\n"
    
    # Test 6: Get the specific light
    echo -e "${YELLOW}6. Testing Get Specific Light...${NC}"
    curl -s -X GET ${API_URL}/lights/$LIGHT_ID | jq '.'
    echo -e "\n"
    
    # Test 7: Get user's lights
    echo -e "${YELLOW}7. Testing Get My Lights...${NC}"
    curl -s -X GET ${API_URL}/lights/my/lights \
      -H "Authorization: Bearer $TOKEN" | jq '.'
    echo -e "\n"
    
    # Test 8: Create Light with Prayer Note (combined endpoint)
    echo -e "${YELLOW}8. Testing Create Light with Prayer Note (combined)...${NC}"
    COMBINED_RESPONSE=$(curl -s -X POST ${API_URL}/lights/with-prayer \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "location": "Los Angeles, CA, USA",
        "title": "Combined Prayer Light",
        "description": "Testing the combined endpoint for creating light with prayer",
        "isAnonymous": false,
        "prayerContent": "This is a test prayer for the combined endpoint. May this light bring peace and healing to all who see it.",
        "prayerIsPublic": true
      }')
    
    echo $COMBINED_RESPONSE | jq '.'
    COMBINED_LIGHT_ID=$(echo $COMBINED_RESPONSE | jq -r '.data.lightId // empty')
    PRAYER_NOTE_ID=$(echo $COMBINED_RESPONSE | jq -r '.data.prayerNoteId // empty')
    echo -e "\n"
    
    if [ ! -z "$COMBINED_LIGHT_ID" ] && [ "$COMBINED_LIGHT_ID" != "null" ]; then
      echo -e "${GREEN}Combined Light and Prayer created successfully!${NC}"
      echo -e "Light ID: $COMBINED_LIGHT_ID"
      echo -e "Prayer Note ID: $PRAYER_NOTE_ID"
      echo -e "\n"
      
      # Test 8.1: Verify the light was created with prayer note reference
      echo -e "${YELLOW}8.1. Verifying Light has Prayer Note reference...${NC}"
      curl -s -X GET ${API_URL}/lights/$COMBINED_LIGHT_ID | jq '.'
      echo -e "\n"
      
      # Clean up the combined light
      echo -e "${YELLOW}8.2. Cleaning up combined light...${NC}"
      curl -s -X DELETE ${API_URL}/lights/$COMBINED_LIGHT_ID \
        -H "Authorization: Bearer $TOKEN" | jq '.'
      echo -e "\n"
    else
      echo -e "${RED}Failed to create combined light and prayer${NC}"
    fi
    
    # Test 9: Update the light
    echo -e "${YELLOW}9. Testing Update Light...${NC}"
    curl -s -X PUT ${API_URL}/lights/$LIGHT_ID \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "title": "Updated Prayer for World Peace",
        "description": "Updated: Lighting a candle for peace, healing, and unity around the world"
      }' | jq '.'
    echo -e "\n"
    
    # Test 10: Get all lights again (should show our created light)
    echo -e "${YELLOW}10. Testing Get All Lights (should include our light)...${NC}"
    curl -s -X GET ${API_URL}/lights?limit=5 | jq '.'
    echo -e "\n"
    
    # Test 11: Delete the light
    echo -e "${YELLOW}11. Testing Delete Light...${NC}"
    curl -s -X DELETE ${API_URL}/lights/$LIGHT_ID \
      -H "Authorization: Bearer $TOKEN" | jq '.'
    echo -e "\n"
    
  else
    echo -e "${RED}Failed to create light${NC}"
  fi
  
else
  echo -e "${RED}Failed to authenticate user${NC}"
fi

echo -e "${GREEN}Light API testing completed!${NC}"
echo
echo -e "${YELLOW}Available endpoints:${NC}"
echo "GET    /api/lights                    # Get all lights (public)"
echo "GET    /api/lights/:id                # Get specific light (public)"
echo "POST   /api/lights                    # Create light (auth required)"
echo "POST   /api/lights/with-prayer        # Create light with prayer note (auth required)"
echo "GET    /api/lights/my/lights          # Get user's lights (auth required)"
echo "PUT    /api/lights/:id                # Update light (auth required, owner only)"
echo "DELETE /api/lights/:id                # Delete light (auth required, owner only)"
