import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsSDK from 'aws-sdk';

// Initialize the AWS SDK CloudWatchLogs client
const cloudWatchLogs = new awsSDK.CloudWatchLogs();

// Function to update retention policy for a log group
async function updateRetentionPolicy(logGroupName: string, retentionInDays: number) {
  return cloudWatchLogs
    .putRetentionPolicy({
      logGroupName,
      retentionInDays,
    })
    .promise();
}

// Create an IAM role for the Lambda function
const lambdaRole = new aws.iam.Role('lambdaRole', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: 'lambda.amazonaws.com' }),
});

// Attach the necessary policies to the Lambda role
new aws.iam.RolePolicyAttachment('lambdaManagedPolicy', {
  role: lambdaRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
});
new aws.iam.RolePolicy('lambdaPolicy', {
  role: lambdaRole,
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: ['logs:DescribeLogGroups', 'logs:PutRetentionPolicy'],
        Effect: 'Allow',
        Resource: '*',
      },
    ],
  }),
});

// Create the Lambda function
const updateLogGroupsLambda = new aws.lambda.Function('updateLogGroupsLambda', {
  runtime: aws.lambda.Runtime.NodeJS20dX,
  code: new pulumi.asset.AssetArchive({
    '.': new pulumi.asset.FileArchive('./lambda'),
  }),
  handler: 'index.handler',
  role: lambdaRole.arn,
});

// Create a CloudWatch Event Rule to trigger the Lambda function once per month
const monthlyEventRule = new aws.cloudwatch.EventRule('monthlyEventRule', {
  scheduleExpression: 'cron(0 0 1 * ? *)', // Runs at midnight on the 1st of every month
});

// Grant the Event Rule permission to invoke the Lambda function
new aws.lambda.Permission('eventRulePermission', {
  action: 'lambda:InvokeFunction',
  function: updateLogGroupsLambda.name,
  principal: 'events.amazonaws.com',
  sourceArn: monthlyEventRule.arn,
});

// Create an Event Target to link the Event Rule to the Lambda function
new aws.cloudwatch.EventTarget('eventTarget', {
  rule: monthlyEventRule.name,
  arn: updateLogGroupsLambda.arn,
});
