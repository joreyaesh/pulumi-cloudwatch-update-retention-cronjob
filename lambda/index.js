const {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  PutRetentionPolicyCommand,
} = require('@aws-sdk/client-cloudwatch-logs');

const cloudWatchLogsClient = new CloudWatchLogsClient();

async function updateRetentionPolicy(logGroupName, retentionInDays) {
  const command = new PutRetentionPolicyCommand({
    logGroupName,
    retentionInDays,
  });
  return cloudWatchLogsClient.send(command);
}

exports.handler = async () => {
  let nextToken;
  do {
    const command = new DescribeLogGroupsCommand({ nextToken });
    const logGroupsResponse = await cloudWatchLogsClient.send(command);
    const logGroups = logGroupsResponse.logGroups || [];

    for (const logGroup of logGroups) {
      if (logGroup.logGroupName) {
        await updateRetentionPolicy(logGroup.logGroupName, 30);
        console.log(`Updated retention policy for log group: ${logGroup.logGroupName}`);
      }
    }

    nextToken = logGroupsResponse.nextToken;
  } while (nextToken);
};
