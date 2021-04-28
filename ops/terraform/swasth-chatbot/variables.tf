#
# Variables Configuration
#

variable "cluster_name" {
  default = "swasth-chatbot-stage"
}

variable "db_password" {
}

variable "vpc_cidr_block" {
  default = "192.168.0.0/16"
}

variable "network_availability_zones" {
  default = ["ap-south-1b", "ap-south-1a"]
}

variable "availability_zones" {
  default = ["ap-south-1b"]
}

variable "kubernetes_version" {
  default = "1.15"
}

variable "instance_type" {
  default = "r5a.large"
}

variable "override_instance_types" {
  default = ["r5a.large", "m5a.large"]
}

variable "number_of_worker_nodes" {
  default = "1"
}

variable "spot_max_price" {
  default = "0.029"
}

variable "ssh_key_name" {
  default = "hasura-ci-dev"
}
