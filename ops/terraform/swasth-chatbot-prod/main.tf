terraform {
  backend "s3" {
    bucket = "swasth-chatbot-prod-terraform-state-store"
    key    = "terraform"
    region = "ap-south-1"
  }
}

module "network" {
  source                       = "../modules/kubernetes/aws/network"
  vpc_cidr_block               = var.vpc_cidr_block
  cluster_name                 = var.cluster_name
  availability_zones           = var.network_availability_zones
  rds_db_source_security_group = module.eks.worker_security_group_id
}

module "db" {
  source                       = "../modules/db/aws"
  subnet_ids                   = module.network.private_subnets
  vpc_security_group_ids       = ["${module.network.rds_db_sg_id}"]
  availability_zone            = element(var.availability_zones, 0)
  instance_class               = "db.m5.large"
  engine_version               = "11.5"
  storage_type                 = "gp2"
  storage_gb                   = "10"
  backup_retention_days        = "7"
  administrator_login          = "swasth_prod"
  administrator_login_password = var.db_password
  db_name                      = "${var.cluster_name}-db"
  environment                  = var.cluster_name
}

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}
provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file       = false
  version                = "~> 1.11"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = var.kubernetes_version
  subnets         = concat(module.network.private_subnets, module.network.public_subnets)

  tags = map(
    "kubernetes.io/cluster/${var.cluster_name}", "owned",
    "KubernetesCluster", "${var.cluster_name}"
  )

  vpc_id = module.network.vpc_id

  worker_groups_launch_template = [
    {
      name                    = "general"
      subnets                 = "${slice(module.network.private_subnets, 0, length(var.availability_zones))}"
      override_instance_types = "${var.override_instance_types}"
      asg_max_size            = "${var.number_of_worker_nodes}"
      asg_desired_capacity    = "${var.number_of_worker_nodes}"
      cpu_credits             = "standard"
    },
  ]
}
