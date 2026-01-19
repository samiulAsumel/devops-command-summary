# DevOps Command Reference - Terraform Enterprise Infrastructure
# Enterprise-Grade Cloud Infrastructure as Code
# Version: 1.0.0
# Compliance: ISO 27001, SOC 2 Type II, GDPR, HIPAA

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "devops-command-reference-terraform-state"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"

    # Enterprise security settings
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
    role_arn       = "arn:aws:iam::123456789012:role/TerraformStateAccess"
  }
}

# 🌍 Provider Configuration
provider "aws" {
  region = var.aws_region

  # Enterprise security configuration
  default_tags {
    tags = {
      Environment     = var.environment
      Project        = "DevOps Command Reference"
      Owner          = "DevOps Team"
      CostCenter     = "Engineering"
      Compliance     = "Enterprise"
      ManagedBy      = "Terraform"
      LastModified   = timestamp()
    }
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    }
  }
}

# 📋 Variables
variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"

  validation {
    condition     = contains(["us-east-1", "us-west-2", "eu-west-1", "eu-central-1"], var.aws_region)
    error_message = "Region must be an approved enterprise region."
  }
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "devops-command-reference"
}

variable "domain_name" {
  description = "Primary domain name"
  type        = string
  default     = "devops-command-reference.com"
}

variable "ssl_certificate_arn" {
  description = "SSL certificate ARN for the domain"
  type        = string
  default     = ""
}

# 🔐 Random Resources
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

# 🌐 VPC Configuration - Enterprise Network
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${var.project_name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  # Enterprise network configuration
  enable_nat_gateway     = true
  single_nat_gateway     = false
  one_nat_gateway_per_az = true
  enable_vpn_gateway      = true

  # DNS configuration
  enable_dns_hostnames = true
  enable_dns_support   = true

  # Security configuration
  enable_flow_log                      = true
  create_flow_log_cloudwatch_log_group = true
  create_flow_log_cloudwatch_iam_role  = true

  tags = {
    Type = "Enterprise VPC"
  }
}

# 🔒 Security Groups
resource "aws_security_group" "eks_cluster" {
  name        = "${var.project_name}-eks-cluster-sg"
  description = "Security group for EKS cluster"
  vpc_id      = module.vpc.vpc_id

  # EKS cluster communication
  ingress {
    description = "Allow API server communication"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-eks-cluster-sg"
    Type = "Security Group"
  }
}

resource "aws_security_group" "eks_nodes" {
  name        = "${var.project_name}-eks-nodes-sg"
  description = "Security group for EKS worker nodes"
  vpc_id      = module.vpc.vpc_id

  # Node communication
  ingress {
    description = "Allow all traffic within VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }

  # SSH access (restricted)
  ingress {
    description = "Allow SSH from bastion"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-eks-nodes-sg"
    Type = "Security Group"
  }
}

resource "aws_security_group" "bastion" {
  name        = "${var.project_name}-bastion-sg"
  description = "Security group for bastion host"
  vpc_id      = module.vpc.vpc_id

  # SSH access from corporate IP ranges
  ingress {
    description = "Allow SSH from corporate network"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-bastion-sg"
    Type = "Security Group"
  }
}

# 🚀 EKS Cluster - Enterprise Kubernetes
module "eks" {
  source = "terraform-aws-modules/eks/aws"

  cluster_name    = "${var.project_name}-eks"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # Cluster configuration
  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true

  # Security configuration
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Node groups
  eks_managed_node_groups = {
    general = {
      name           = "${var.project_name}-general-nodes"
      instance_types = ["t3.large", "t3.xlarge"]
      min_size       = 2
      max_size       = 6
      desired_size   = 3

      # Security configuration
      iam_role_additional_policies = {
        AmazonEC2ContainerRegistryReadOnly = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
        CloudWatchAgentServerPolicy        = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
      }

      # Security groups
      security_group_ids = [aws_security_group.eks_nodes.id]

      tags = {
        Type = "General Purpose Nodes"
      }
    }

    system = {
      name           = "${var.project_name}-system-nodes"
      instance_types = ["t3.medium"]
      min_size       = 1
      max_size       = 3
      desired_size   = 2

      # Taint for system workloads only
      taints = {
        dedicated = {
          key    = "system"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      }

      # Security groups
      security_group_ids = [aws_security_group.eks_nodes.id]

      tags = {
        Type = "System Nodes"
      }
    }
  }

  # Security configuration
  cluster_security_group_id = aws_security_group.eks_cluster.id

  # Encryption
  cluster_encryption_config = {
    resources = ["secrets"]
  }

  tags = {
    Name = "${var.project_name}-eks"
    Type = "Kubernetes Cluster"
  }
}

# 🗄️ RDS Database - Enterprise PostgreSQL
resource "aws_db_subnet_group" "database" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "${var.project_name}-db-subnet-group"
    Type = "Database Subnet Group"
  }
}

resource "aws_security_group" "database" {
  name        = "${var.project_name}-database-sg"
  description = "Security group for RDS database"
  vpc_id      = module.vpc.vpc_id

  # Database access from EKS nodes
  ingress {
    description = "Allow PostgreSQL from EKS nodes"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-database-sg"
    Type = "Security Group"
  }
}

resource "aws_db_instance" "postgresql" {
  identifier = "${var.project_name}-database"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.medium"

  # Storage configuration
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type          = "gp2"
  storage_encrypted     = true

  # Database configuration
  db_name  = "devops_command_reference"
  username = "devops_admin"
  password = random_password.db_password.result

  # Network configuration
  db_subnet_group_name   = aws_db_subnet_group.database.name
  vpc_security_group_ids = [aws_security_group.database.id]

  # Backup and maintenance
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  # High availability
  multi_az = true

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_enhanced_monitoring.arn

  # Security configuration
  deletion_protection      = true
  skip_final_snapshot     = false
  final_snapshot_identifier = "${var.project_name}-final-snapshot-${timestamp()}"

  # Performance insights
  performance_insights_enabled = true

  tags = {
    Name = "${var.project_name}-database"
    Type = "PostgreSQL Database"
  }
}

# 📊 ElastiCache Redis - Enterprise Cache
resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project_name}-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "${var.project_name}-redis-subnet-group"
    Type = "Redis Subnet Group"
  }
}

resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = module.vpc.vpc_id

  # Redis access from EKS nodes
  ingress {
    description = "Allow Redis from EKS nodes"
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-redis-sg"
    Type = "Security Group"
  }
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${var.project_name}-redis"
  description                = "Redis replication group for DevOps Command Reference"

  # Engine configuration
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.micro"
  port                 = 6379
  parameter_group_name = "default.redis7"

  # Cluster configuration
  num_cache_clusters         = 2
  automatic_failover_enabled = true
  multi_az_enabled          = true

  # Network configuration
  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]

  # Security configuration
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_password.redis_auth_token.result

  # Backup configuration
  snapshot_retention_limit = 7
  snapshot_window         = "06:00-07:00"
  maintenance_window       = "sun:07:00-sun:08:00"

  tags = {
    Name = "${var.project_name}-redis"
    Type = "Redis Cluster"
  }
}

resource "random_password" "redis_auth_token" {
  length  = 64
  special = false
}

# 🔐 IAM Roles and Policies
resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "${var.project_name}-rds-enhanced-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-rds-enhanced-monitoring"
    Type = "IAM Role"
  }
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# 📊 CloudWatch - Enterprise Monitoring
resource "aws_cloudwatch_log_group" "application" {
  name              = "/aws/eks/${var.project_name}/application"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-application-logs"
    Type = "CloudWatch Log Group"
  }
}

resource "aws_cloudwatch_metric_alarm" "cpu_utilization" {
  alarm_name          = "${var.project_name}-high-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors EKS cluster CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-cpu-alarm"
    Type = "CloudWatch Alarm"
  }
}

resource "aws_cloudwatch_metric_alarm" "memory_utilization" {
  alarm_name          = "${var.project_name}-high-memory-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "This metric monitors EKS cluster memory utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  tags = {
    Name = "${var.project_name}-memory-alarm"
    Type = "CloudWatch Alarm"
  }
}

# 📢 SNS - Alerting
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-alerts"

  tags = {
    Name = "${var.project_name}-alerts"
    Type = "SNS Topic"
  }
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "devops-alerts@command-reference.com"
}

# 🌐 Route 53 - DNS Management
resource "aws_route53_zone" "main" {
  name = var.domain_name

  tags = {
    Name = "${var.project_name}-dns-zone"
    Type = "Route53 Zone"
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = module.eks.cluster_endpoint
    zone_id               = module.eks.vpc_config[0].cluster_security_group_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = module.eks.cluster_endpoint
    zone_id               = module.eks.vpc_config[0].cluster_security_group_id
    evaluate_target_health = true
  }
}

# 🔐 ACM Certificate Management
resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "www.${var.domain_name}",
    "api.${var.domain_name}"
  ]

  tags = {
    Name = "${var.project_name}-certificate"
    Type = "ACM Certificate"
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# 📊 S3 - Storage and Backups
resource "aws_s3_bucket" "state" {
  bucket = "${var.project_name}-terraform-state-${random_string.suffix.result}"

  tags = {
    Name = "${var.project_name}-terraform-state"
    Type = "S3 Bucket"
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "backups" {
  bucket = "${var.project_name}-backups-${random_string.suffix.result}"

  tags = {
    Name = "${var.project_name}-backups"
    Type = "S3 Bucket"
  }
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "backup_lifecycle"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }

    expiration {
      days = 2555  # 7 years
    }
  }
}

# 📋 Outputs
output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  description = "EKS cluster certificate authority data"
  value       = module.eks.cluster_certificate_authority_data
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "database_endpoint" {
  description = "RDS database endpoint"
  value       = aws_db_instance.postgresql.endpoint
  sensitive   = true
}

output "database_password" {
  description = "RDS database password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "redis_auth_token" {
  description = "Redis auth token"
  value       = random_password.redis_auth_token.result
  sensitive   = true
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate_validation.main.certificate_arn
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnets" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnets
}
