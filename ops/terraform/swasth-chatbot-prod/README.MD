# Infrastructure setup on AWS

Create a kubernetes cluster with spot instances and a Postgres RDS on AWS using terraform


# Pre-Requisites

 - Terraform
 - AWS Cli
 - kubectl
 - aws-iam-authenticator

`brew install terraform awscli aws-iam-authenticator kubectl`


## Create
Infrastructure can be created by running below commands. Provide DB_PASSWORD to be set, and change variables.tf or main.tf, accordingly if required.

    cd remote-state && terraform init && terraform apply
    cd .. && terraform init
    terraform plan
    terraform apply
  
  Once successfully executed, use the generated kubeconfig to deploy the manifests,
  

    export KUBECONFIG=kubeconfig_hasura-dev
   Follow instructions below to deploy Hasura on Kubernetes,
   https://github.com/hasura/graphql-engine/tree/master/install-manifests/kubernetes

## Destroy

    terraform destroy

