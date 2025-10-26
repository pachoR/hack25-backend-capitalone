output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.vpc.private_subnet_ids
}

# ALB outputs disabled (no ALB support in account)
# output "alb_dns_name" {
#   description = "DNS name of the Application Load Balancer"
#   value       = module.alb.alb_dns_name
# }

# output "alb_url" {
#   description = "URL of the Application Load Balancer"
#   value       = "http://${module.alb.alb_dns_name}"
# }

output "ec2_instance_id" {
  description = "ID of the EC2 instance"
  value       = module.ec2.instance_id
}

output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = module.ec2.public_ip
}

output "api_url" {
  description = "Direct API URL (no ALB)"
  value       = "http://${module.ec2.public_ip}:8080"
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.db_endpoint
}

output "rds_database_name" {
  description = "Name of the RDS database"
  value       = module.rds.db_name
}

output "ssh_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${module.ec2.public_ip}"
}

output "health_check_url" {
  description = "Health check endpoint"
  value       = "http://${module.ec2.public_ip}:8080/health"
}
