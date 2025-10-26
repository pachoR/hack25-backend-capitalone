#!/bin/bash

# AWS Infrastructure Status Check Script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "======================================"
echo "Infrastructure Status Check"
echo "======================================"
echo ""

# Check if terraform state exists
if [ ! -f "terraform.tfstate" ]; then
    echo -e "${RED}✗ No infrastructure deployed${NC}"
    echo "Run: ./deploy.sh"
    exit 1
fi

# Get outputs
echo -e "${BLUE}Getting infrastructure details...${NC}"
echo ""

ALB_DNS=$(terraform output -raw alb_dns_name 2>/dev/null || echo "N/A")
EC2_IP=$(terraform output -raw ec2_public_ip 2>/dev/null || echo "N/A")
RDS_ENDPOINT=$(terraform output -raw rds_endpoint 2>/dev/null || echo "N/A")

echo "======================================"
echo "Infrastructure Details"
echo "======================================"
echo -e "ALB URL:      http://$ALB_DNS"
echo -e "EC2 IP:       $EC2_IP"
echo -e "RDS Endpoint: $RDS_ENDPOINT"
echo ""

# Check ALB health
echo "======================================"
echo "Health Checks"
echo "======================================"

if [ "$ALB_DNS" != "N/A" ]; then
    echo -n "ALB Health: "
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$ALB_DNS/health" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Healthy (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}✗ Unhealthy (HTTP $HTTP_CODE)${NC}"
        echo -e "${YELLOW}Note: This is normal for ~10 minutes after deployment${NC}"
    fi
else
    echo -e "${RED}✗ ALB DNS not available${NC}"
fi

echo ""

# Check EC2 status via AWS CLI (if available)
if command -v aws &> /dev/null; then
    echo "======================================"
    echo "AWS Resources Status"
    echo "======================================"
    
    INSTANCE_ID=$(terraform output -raw ec2_instance_id 2>/dev/null || echo "")
    
    if [ ! -z "$INSTANCE_ID" ]; then
        INSTANCE_STATE=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" --query 'Reservations[0].Instances[0].State.Name' --output text 2>/dev/null || echo "unknown")
        echo -e "EC2 Instance: ${GREEN}$INSTANCE_STATE${NC}"
    fi
    
    # Check target group health
    TG_ARN=$(terraform output -json | jq -r '.target_group_arn.value' 2>/dev/null || echo "")
    if [ ! -z "$TG_ARN" ]; then
        TG_HEALTH=$(aws elbv2 describe-target-health --target-group-arn "$TG_ARN" --query 'TargetHealthDescriptions[0].TargetHealth.State' --output text 2>/dev/null || echo "unknown")
        echo -e "Target Health: ${GREEN}$TG_HEALTH${NC}"
    fi
fi

echo ""
echo "======================================"
echo "Quick Actions"
echo "======================================"
echo "Test endpoint:  curl http://$ALB_DNS/health"
echo "View outputs:   terraform output"
echo "SSH to EC2:     ssh -i ~/.ssh/your-key.pem ubuntu@$EC2_IP"
echo "Destroy infra:  ./deploy.sh --destroy"
echo ""
