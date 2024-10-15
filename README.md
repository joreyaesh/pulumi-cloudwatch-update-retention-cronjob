# CloudWatch Update Retention Cronjob

This repository contains an AWS Lambda function that updates the retention policy for all CloudWatch Logs log groups to 30 days. The Lambda function is triggered once per month using a CloudWatch Event Rule.

## Project Structure

```
├── LICENSE
├── Pulumi.prod.yaml
├── Pulumi.yaml
├── README.md
├── index.ts
├── lambda
│   └── index.js
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

## Files

- **README.md**: This project README file.
- **index.ts**: Contains the Pulumi infrastructure code to set up the Lambda function, IAM roles, and CloudWatch Event Rule.
- **lambda/index.js**: Contains the Lambda function code that updates the retention policy for CloudWatch Logs log groups.
- **Pulumi.yaml** and **Pulumi.prod.yaml**: Pulumi configuration files for the project.
- **package.json**: Contains the project dependencies and scripts.
- **pnpm-lock.yaml**: Lockfile for pnpm package manager.
- **tsconfig.json**: TypeScript configuration file.
- **.gitignore**: Specifies intentionally untracked files to ignore.
- **LICENSE**: The license for the project.

## Setup

1. **Install Dependencies**:

   ```sh
   pnpm install
   ```

2. **Configure AWS Credentials**:

   Ensure your AWS credentials are configured. You can use the AWS CLI to configure them:

   ```sh
   aws configure
   ```

3. **Deploy the Infrastructure**:

   Use Pulumi to deploy the infrastructure:

   ```sh
   pulumi up
   ```

## Lambda Function

The Lambda function is defined in `lambda/index.js`. It uses the AWS SDK to describe log groups and update their retention policies.

## Pulumi Infrastructure

The Pulumi infrastructure code is defined in `index.ts`. It sets up the IAM roles, Lambda function, and CloudWatch Event Rule to schedule the Lambda execution.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
