# HHLD-ECS-DEMO

### Steps:
### Manual CI/CD:
1. Push your image to Amazon Elastic Container Registry
    - Create an AWS ECR repository to store your image.
    - Tag the image
    - Run the aws ecr get-login-password command
    - Push the image to Amazon ECR

2. Create the cluster

3. Create a task definition
    - Specify image URL from ECR repository
    - Add port mapping

4. Go back to the cluster and Create a service using the task definition
    - Mention task and no of tasks
    - Add Application Load Balancer(select VPC, subnets - public)
    - Add auto scaling and policy for that.
    - Notice the no of tasks in your created service
    - Go to the LB you created
    - Check security group of LB and allow inbound rule for HTTP(**PORT mapping in task definition from anywhere**)
    - Checkout the public URL of LB

5. Rolling update
    - Make change in your code and push it to ECR
    - Go back to service and update it - force new deployment
    - Check the tasks and their health statuses (keep refreshing)
    - Check the same public URL of LB.


### CICD using GitHub(Git Actions)
- Create Git Repo and push code.
- Go to` Actions` > `Deploy to Amazon ECS`
- Change env values from AWS
- For task definition => Download JSON from AWS and upload file on GitHub
- In GitHub, go to `settings` > `secrets and variables` > `actions`
- Add repo secrets from AWS => `Profile > Security credentials > Access Keys`
- Make change in your GitHub code (or push changes)
- Go to Actions and see Deployment

---
### Reference Docs:
- [Detailed Steps](docs/ECS-Implementation-Steps.pdf)

- [Sample AWS YML](docs/aws.yml)
    - Update values under `env` section.
---
### Mistakes:

- **Issue:** Unrecognized Client Exception while running the tasks in ECS cluster.
    - **Solution:** Either attach NAT gateway or create the tasks in public subnets.