terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "hack25-capitalone"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name         = var.project_name
  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# Security Groups Module
module "security_groups" {
  source = "./modules/security-groups"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  allowed_cidr_blocks = var.allowed_cidr_blocks
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  project_name         = var.project_name
  environment          = var.environment
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password
  db_instance_class    = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_engine_version    = var.db_engine_version
  db_subnet_ids        = module.vpc.private_subnet_ids
  db_security_group_id = module.security_groups.rds_security_group_id
}

# ALB Module - DISABLED (account doesn't support ALB)
# module "alb" {
#   source = "./modules/alb"
#
#   project_name          = var.project_name
#   environment           = var.environment
#   vpc_id                = module.vpc.vpc_id
#   public_subnet_ids     = module.vpc.public_subnet_ids
#   alb_security_group_id = module.security_groups.alb_security_group_id
# }

# EC2 Module
module "ec2" {
  source = "./modules/ec2"

  project_name          = var.project_name
  environment           = var.environment
  instance_type         = var.instance_type
  key_name              = var.key_name
  public_subnet_ids     = module.vpc.public_subnet_ids
  ec2_security_group_id = module.security_groups.ec2_security_group_id
  target_group_arn      = null  # No ALB

  # Database configuration
  db_host     = module.rds.db_endpoint
  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
  db_port     = module.rds.db_port

  # GitHub repository (for cloning the code)
  github_repo_url = var.github_repo_url
  github_branch   = var.github_branch
}
