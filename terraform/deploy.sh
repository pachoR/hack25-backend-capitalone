#!/bin/bash

# Terraform Deployment Helper Script for hack25-backend-capitalone
# This script helps you deploy the infrastructure to AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Terraform is installed
check_terraform() {
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed"
        echo "Please install Terraform from: https://www.terraform.io/downloads"
        exit 1
    fi
    print_success "Terraform is installed ($(terraform version | head -n1))"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_warning "AWS CLI is not installed"
        echo "Please install AWS CLI from: https://aws.amazon.com/cli/"
        return 1
    fi
    print_success "AWS CLI is installed"
    return 0
}

# Check AWS credentials
check_aws_credentials() {
    if check_aws_cli; then
        if aws sts get-caller-identity &> /dev/null; then
            ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
            USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
            print_success "AWS credentials configured"
            print_info "Account: $ACCOUNT_ID"
            print_info "User/Role: $USER_ARN"
        else
            print_error "AWS credentials not configured properly"
            echo "Run: aws configure"
            exit 1
        fi
    fi
}

# Check if terraform.tfvars exists
check_tfvars() {
    if [ ! -f "terraform.tfvars" ]; then
        print_warning "terraform.tfvars not found"
        echo ""
        echo "Creating terraform.tfvars from example..."
        cp terraform.tfvars.example terraform.tfvars
        print_success "Created terraform.tfvars"
        echo ""
        print_warning "IMPORTANT: Edit terraform.tfvars with your values before proceeding!"
        echo "Required changes:"
        echo "  1. key_name: Your EC2 key pair name"
        echo "  2. db_password: A secure database password"
        echo "  3. allowed_cidr_blocks: Your IP address (for security)"
        echo ""
        read -p "Press Enter after editing terraform.tfvars..."
    else
        print_success "terraform.tfvars exists"
    fi
}

# Initialize Terraform
init_terraform() {
    print_info "Initializing Terraform..."
    terraform init
    print_success "Terraform initialized"
}

# Validate Terraform configuration
validate_terraform() {
    print_info "Validating Terraform configuration..."
    terraform validate
    print_success "Configuration is valid"
}

# Format Terraform files
format_terraform() {
    print_info "Formatting Terraform files..."
    terraform fmt -recursive
    print_success "Files formatted"
}

# Plan Terraform deployment
plan_terraform() {
    print_info "Creating Terraform plan..."
    terraform plan -out=tfplan
    print_success "Plan created successfully"
}

# Apply Terraform deployment
apply_terraform() {
    print_info "Applying Terraform configuration..."
    echo ""
    print_warning "This will create resources in AWS and may incur costs!"
    echo ""
    read -p "Do you want to proceed? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        terraform apply tfplan
        print_success "Infrastructure deployed successfully!"
        echo ""
        echo "======================================"
        echo "Deployment Information"
        echo "======================================"
        terraform output
        echo ""
        print_info "Save these outputs for accessing your application"
    else
        print_warning "Deployment cancelled"
        exit 0
    fi
}

# Destroy infrastructure
destroy_terraform() {
    print_warning "This will DESTROY all infrastructure and data!"
    echo ""
    read -p "Are you absolutely sure? Type 'destroy' to confirm: " confirm
    
    if [ "$confirm" = "destroy" ]; then
        terraform destroy
        print_success "Infrastructure destroyed"
    else
        print_warning "Destruction cancelled"
        exit 0
    fi
}

# Show outputs
show_outputs() {
    terraform output
}

# Get health status
check_health() {
    if [ ! -f "terraform.tfstate" ]; then
        print_error "No infrastructure deployed yet"
        exit 1
    fi
    
    ALB_DNS=$(terraform output -raw alb_dns_name 2>/dev/null || echo "")
    
    if [ -z "$ALB_DNS" ]; then
        print_error "Could not get ALB DNS name"
        exit 1
    fi
    
    print_info "Checking application health..."
    echo ""
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$ALB_DNS/health" || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "Application is healthy! (HTTP $HTTP_CODE)"
        echo "URL: http://$ALB_DNS"
    else
        print_error "Application health check failed (HTTP $HTTP_CODE)"
        echo "This is normal if deployment just completed. Wait 5-10 minutes."
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "======================================"
    echo "Terraform Deployment Helper"
    echo "hack25-backend-capitalone"
    echo "======================================"
    echo ""
    echo "1. Full deployment (recommended for first time)"
    echo "2. Initialize Terraform only"
    echo "3. Plan deployment"
    echo "4. Apply deployment"
    echo "5. Show outputs"
    echo "6. Check application health"
    echo "7. Destroy infrastructure"
    echo "8. Exit"
    echo ""
}

# Main script
main() {
    cd "$(dirname "$0")"
    
    echo ""
    echo "======================================"
    echo "Pre-flight Checks"
    echo "======================================"
    echo ""
    
    check_terraform
    check_aws_credentials
    
    echo ""
    
    if [ "$1" = "--auto" ]; then
        # Automated deployment
        check_tfvars
        init_terraform
        validate_terraform
        format_terraform
        plan_terraform
        apply_terraform
    elif [ "$1" = "--destroy" ]; then
        # Destroy infrastructure
        destroy_terraform
    else
        # Interactive menu
        while true; do
            show_menu
            read -p "Select an option (1-8): " choice
            
            case $choice in
                1)
                    check_tfvars
                    init_terraform
                    validate_terraform
                    format_terraform
                    plan_terraform
                    apply_terraform
                    ;;
                2)
                    init_terraform
                    ;;
                3)
                    plan_terraform
                    ;;
                4)
                    apply_terraform
                    ;;
                5)
                    show_outputs
                    ;;
                6)
                    check_health
                    ;;
                7)
                    destroy_terraform
                    ;;
                8)
                    print_info "Goodbye!"
                    exit 0
                    ;;
                *)
                    print_error "Invalid option"
                    ;;
            esac
            
            echo ""
            read -p "Press Enter to continue..."
        done
    fi
}

# Run main
main "$@"
