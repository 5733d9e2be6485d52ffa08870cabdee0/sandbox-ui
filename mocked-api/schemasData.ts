export const schemaCatalogData = [
  {
    kind: "ProcessorSchemaEntry",
    id: "ansible_tower_job_template_sink_0.1",
    name: "Ansible Tower Job Template",
    description: "Launch a job template in Ansible Tower.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/ansible_tower_job_template_sink_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "kafka_topic_sink_0.1",
    name: "Kafka Topic",
    description: "Send the event to a kafka topic.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/kafka_topic_sink_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "send_to_bridge_sink_0.1",
    name: "Send To Bridge",
    description: "Send the event to a Bridge instance.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/send_to_bridge_sink_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "slack_sink_0.1",
    name: "Slack",
    description: "Send the event to a slack channel.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/slack_sink_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "webhook_sink_0.1",
    name: "Webhook",
    description: "Send the event to a webhook.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/webhook_sink_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "aws_lambda_sink_0.1",
    name: "AWS Lambda",
    description: "Send the event to an AWS lambda.",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/aws_lambda_sink_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "google_pubsub_sink_0.1",
    name: "Google PubSub",
    description: "Send the event to Google PubSub",
    type: "action",
    href: "/api/smartevents_mgmt/v1/schemas/actions/google_pubsub_sink_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "aws_s3_source_0.1",
    name: "Aws S3 Source",
    description: "Ingest data from Aws S3.",
    type: "source",
    href: "/api/smartevents_mgmt/v1/schemas/sources/aws_s3_source_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "aws_sqs_source_0.1",
    name: "Aws Sqs Source",
    description: "Ingest data from Aws Sqs.",
    type: "source",
    href: "/api/smartevents_mgmt/v1/schemas/sources/aws_sqs_source_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "slack_source_0.1",
    name: "Slack Source",
    description: "Ingest data from a Slack channel.",
    type: "source",
    href: "/api/smartevents_mgmt/v1/schemas/sources/slack_source_0.1",
  },
  {
    kind: "ProcessorSchemaEntry",
    id: "google_pubsub_source_0.1",
    name: "Google PubSub Source",
    description: "Ingest data from Google PubSub.",
    type: "source",
    href: "/api/smartevents_mgmt/v1/schemas/sources/google_pubsub_source_0.1",
  },
];

export const schemasData: { [key: string]: object } = {
  "ansible_tower_job_template_sink_0.1": {
    type: "object",
    additionalProperties: false,
    properties: {
      endpoint: {
        type: "string",
        title: "Endpoint",
        description: "Ansible Tower instance base endpoint.",
        pattern:
          "(http|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])",
        example: "https://my.ansible-tower.host",
      },
      job_template_id: {
        type: "string",
        title: "Job Template ID",
        description: "The ID of the job template to trigger.",
        example: "14",
      },
      basic_auth_username: {
        type: "string",
        title: "Basic Auth Username",
        description: "The username for basic auth.",
        example: "kermit",
      },
      basic_auth_password: {
        type: "string",
        title: "Basic Auth Password",
        description: "The password for basic auth.",
        example: "mypassword",
      },
      ssl_verification_disabled: {
        type: "boolean",
        title: "SSL Verification Disabled",
        description: "Specify if SSL verification has to be disabled",
        default: false,
      },
    },
    required: ["endpoint", "job_template_id"],
    optional: [
      "basic_auth_username",
      "basic_auth_password",
      "ssl_verification_disabled",
    ],
    dependentRequired: {
      basic_auth_username: ["basic_auth_password"],
      basic_auth_password: ["basic_auth_username"],
    },
  },
  "kafka_topic_sink_0.1": {
    type: "object",
    additionalProperties: false,
    properties: {
      topic: {
        type: "string",
        title: "Topic Name",
        description: "The topic where to send the event.",
        example: "my-topic",
      },
      kafka_broker_url: {
        type: "string",
        title: "Broker URL",
        description: "RHOSAK Broker URL",
        example: "username-c--hj---mhlksdfss-p--a.bf2.kafka.rhcloud.com:443",
      },
      kafka_client_id: {
        type: "string",
        title: "Client Id",
        description:
          "The Client Id part of the credentials to authenticate to Kafka",
      },
      kafka_client_secret: {
        type: "string",
        title: "Client Secret",
        description:
          "The Client Secret part of the credentials to authenticate to Kafka",
      },
    },
    required: [
      "topic",
      "kafka_broker_url",
      "kafka_client_id",
      "kafka_client_secret",
    ],
  },
  "send_to_bridge_sink_0.1": {
    type: "object",
    additionalProperties: false,
    properties: {
      bridgeId: {
        type: "string",
        title: "Bridge ID",
        description:
          "The bridgeId of the instance to target. If not specified the bridgeId is the processor's owner bridge itself.",
        example: "f1fbd010-93cf-4be1-aa78-b37ba48858fe",
      },
    },
    optional: ["bridgeId"],
  },
  "slack_sink_0.1": {
    type: "object",
    additionalProperties: false,
    required: ["slack_channel", "slack_webhook_url"],
    properties: {
      slack_channel: {
        title: "Channel",
        description: "The Slack channel to send messages to.",
        type: "string",
        example: "#myroom",
      },
      slack_webhook_url: {
        title: "Webhook URL",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Webhook URL",
            description:
              "The webhook URL used by the Slack channel to handle incoming messages.",
            type: "string",
            format: "password",
            $comment: "https://stackoverflow.com/a/6041965/9360757",
            pattern:
              "(http|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])",
          },
          {
            description: "An opaque reference to the slack_webhook_url",
            type: "object",
            properties: {},
          },
        ],
      },
      slack_icon_emoji: {
        title: "Icon Emoji",
        description: "Use a Slack emoji as an avatar.",
        type: "string",
      },
      slack_icon_url: {
        title: "Icon URL",
        description:
          "The avatar that the component will use when sending message to a channel or user.",
        type: "string",
      },
      slack_username: {
        title: "Username",
        description:
          "This is the username that the bot will have when sending messages to a channel or user.",
        type: "string",
      },
    },
  },
  "webhook_sink_0.1": {
    type: "object",
    additionalProperties: false,
    properties: {
      endpoint: {
        type: "string",
        title: "Endpoint",
        description: "The endpoint that receives the webhook.",
        $comment: "https://stackoverflow.com/a/6041965/9360757",
        pattern:
          "(http|https):\\/\\/([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])",
        example: "https://webhook.site/#!/f1fbd010-93cf-4be1-aa78-b37ba48858fe",
      },
      basic_auth_username: {
        type: "string",
        title: "Basic Auth Username",
        description: "The username for basic auth.",
        example: "kermit",
        format: "password",
      },
      basic_auth_password: {
        type: "string",
        title: "Basic Auth Password",
        description: "The password for basic auth.",
        example: "mypassword",
        format: "password",
      },
      ssl_verification_disabled: {
        type: "boolean",
        title: "SSL Verification Disabled",
        description: "Specify if SSL verification has to be disabled",
        example: "false",
        default: false,
      },
    },
    required: ["endpoint"],
    optional: [
      "basic_auth_username",
      "basic_auth_password",
      "ssl_verification_disabled",
    ],
    dependentRequired: {
      basic_auth_username: ["basic_auth_password"],
      basic_auth_password: ["basic_auth_username"],
    },
  },
  "aws_lambda_sink_0.1": {
    type: "object",
    additionalProperties: false,
    required: [
      "aws_function",
      "aws_region",
      "aws_access_key",
      "aws_secret_key",
    ],
    properties: {
      aws_function: {
        title: "Function Name",
        description: "The Lambda Function name",
        type: "string",
      },
      aws_access_key: {
        title: "Access Key",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Access Key",
            description: "The access key obtained from AWS",
            type: "string",
            format: "password",
          },
          {
            description: "An opaque reference to the aws_access_key",
            type: "object",
            properties: {},
          },
        ],
      },
      aws_secret_key: {
        title: "Secret Key",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Secret Key",
            description: "The secret key obtained from AWS",
            type: "string",
            format: "password",
          },
          {
            description: "An opaque reference to the aws_secret_key",
            type: "object",
            properties: {},
          },
        ],
      },
      aws_region: {
        title: "AWS Region",
        description: "The AWS region to connect to",
        type: "string",
        example: "eu-west-1",
        enum: [
          "af-south-1",
          "ap-east-1",
          "ap-northeast-1",
          "ap-northeast-2",
          "ap-northeast-3",
          "ap-south-1",
          "ap-southeast-1",
          "ap-southeast-2",
          "ap-southeast-3",
          "ca-central-1",
          "eu-central-1",
          "eu-north-1",
          "eu-south-1",
          "eu-west-1",
          "eu-west-2",
          "eu-west-3",
          "fips-us-east-1",
          "fips-us-east-2",
          "fips-us-west-1",
          "fips-us-west-2",
          "me-south-1",
          "sa-east-1",
          "us-east-1",
          "us-east-2",
          "us-west-1",
          "us-west-2",
          "cn-north-1",
          "cn-northwest-1",
          "us-gov-east-1",
          "us-gov-west-1",
          "us-iso-east-1",
          "us-iso-west-1",
          "us-isob-east-1",
        ],
      },
    },
  },
  "google_pubsub_sink_0.1": {
    type: "object",
    additionalProperties: false,
    required: [
      "gcp_project_id",
      "gcp_destination_name",
      "gcp_service_account_key",
    ],
    properties: {
      gcp_project_id: {
        title: "Project Id",
        description: "The Google Cloud PubSub Project Id",
        type: "string",
      },
      gcp_destination_name: {
        title: "Destination Name",
        description:
          "The Destination Name. For the consumer this will be the subscription name, while for the producer this will be the topic name.",
        type: "string",
      },
      gcp_service_account_key: {
        title: "Service Account Key",
        description:
          "The Service account key that can be used as credentials for the PubSub publisher/subscriber in base64 encoding.",
        type: "string",
        "x-group": "credentials",
        format: "base64",
      },
    },
  },
  "aws_s3_source_0.1": {
    type: "object",
    additionalProperties: false,
    required: [
      "aws_bucket_name_or_arn",
      "aws_region",
      "aws_access_key",
      "aws_secret_key",
    ],
    properties: {
      aws_bucket_name_or_arn: {
        title: "Bucket Name",
        description: "The S3 Bucket name or ARN",
        type: "string",
      },
      aws_delete_after_read: {
        title: "Auto-delete Objects",
        description: "Delete objects after consuming them",
        type: "boolean",
        default: true,
      },
      aws_access_key: {
        title: "Access Key",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Access Key",
            description: "The access key obtained from AWS",
            type: "string",
            format: "password",
          },
          {
            description: "An opaque reference to the aws_access_key",
            type: "object",
            properties: {},
          },
        ],
      },
      aws_secret_key: {
        title: "Secret Key",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Secret Key",
            description: "The secret key obtained from AWS",
            type: "string",
            format: "password",
          },
          {
            description: "An opaque reference to the aws_secret_key",
            type: "object",
            properties: {},
          },
        ],
      },
      aws_region: {
        title: "AWS Region",
        description: "The AWS region to connect to",
        type: "string",
        example: "eu-west-1",
        enum: [
          "af-south-1",
          "ap-east-1",
          "ap-northeast-1",
          "ap-northeast-2",
          "ap-northeast-3",
          "ap-south-1",
          "ap-southeast-1",
          "ap-southeast-2",
          "ap-southeast-3",
          "ca-central-1",
          "eu-central-1",
          "eu-north-1",
          "eu-south-1",
          "eu-west-1",
          "eu-west-2",
          "eu-west-3",
          "fips-us-east-1",
          "fips-us-east-2",
          "fips-us-west-1",
          "fips-us-west-2",
          "me-south-1",
          "sa-east-1",
          "us-east-1",
          "us-east-2",
          "us-west-1",
          "us-west-2",
          "cn-north-1",
          "cn-northwest-1",
          "us-gov-east-1",
          "us-gov-west-1",
          "us-iso-east-1",
          "us-iso-west-1",
          "us-isob-east-1",
        ],
      },
      aws_auto_create_bucket: {
        title: "Autocreate Bucket",
        description: "Setting the autocreation of the S3 bucket bucketName.",
        type: "boolean",
        default: false,
      },
      aws_include_body: {
        title: "Include Body",
        description:
          "If it is true, the exchange will be consumed and put into the body and closed. If false the S3Object stream will be put raw into the body and the headers will be set with the S3 object metadata.",
        type: "boolean",
        default: true,
      },
      aws_prefix: {
        title: "Prefix",
        description: "The AWS S3 bucket prefix to consider while searching",
        type: "string",
        example: "folder/",
      },
      aws_ignore_body: {
        title: "Ignore Body",
        description:
          "If it is true, the S3 Object Body will be ignored completely, if it is set to false the S3 Object will be put in the body. Setting this to true, will override any behavior defined by includeBody option.",
        type: "boolean",
        default: false,
      },
      aws_uri_endpoint_override: {
        title: "Overwrite Endpoint URI",
        description:
          "Set the overriding endpoint URI. This option needs to be used in combination with overrideEndpoint option.",
        type: "string",
      },
      aws_override_endpoint: {
        title: "Endpoint Overwrite",
        description:
          "Set the need for overiding the endpoint URI. This option needs to be used in combination with uriEndpointOverride setting.",
        type: "boolean",
        default: false,
      },
      aws_delay: {
        title: "Delay",
        description: "Milliseconds before the next poll of the selected bucket",
        type: "integer",
        default: 500,
      },
    },
  },
  "aws_sqs_source_0.1": {
    type: "object",
    additionalProperties: false,
    required: [
      "aws_queue_name_or_arn",
      "aws_region",
      "aws_access_key",
      "aws_secret_key",
    ],
    properties: {
      aws_queue_name_or_arn: {
        title: "Queue Name",
        description: "The SQS Queue Name or ARN",
        type: "string",
        pattern:
          "^https://sqs\\.([a-z]+-[a-z]+-[0-9])\\.amazonaws\\.com/[0-9]{12}/([^/]+)$",
      },
      aws_delete_after_read: {
        title: "Auto-delete Messages",
        description: "Delete messages after consuming them",
        type: "boolean",
        default: true,
      },
      aws_access_key: {
        title: "Access Key",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Access Key",
            description: "The access key obtained from AWS",
            type: "string",
            format: "password",
          },
          {
            description: "An opaque reference to the aws_access_key",
            type: "object",
            properties: {},
          },
        ],
      },
      aws_secret_key: {
        title: "Secret Key",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Secret Key",
            description: "The secret key obtained from AWS",
            type: "string",
            format: "password",
          },
          {
            description: "An opaque reference to the aws_secret_key",
            type: "object",
            properties: {},
          },
        ],
      },
      aws_region: {
        title: "AWS Region",
        description: "The AWS region to connect to",
        type: "string",
        example: "eu-west-1",
        enum: [
          "af-south-1",
          "ap-east-1",
          "ap-northeast-1",
          "ap-northeast-2",
          "ap-northeast-3",
          "ap-south-1",
          "ap-southeast-1",
          "ap-southeast-2",
          "ap-southeast-3",
          "ca-central-1",
          "eu-central-1",
          "eu-north-1",
          "eu-south-1",
          "eu-west-1",
          "eu-west-2",
          "eu-west-3",
          "fips-us-east-1",
          "fips-us-east-2",
          "fips-us-west-1",
          "fips-us-west-2",
          "me-south-1",
          "sa-east-1",
          "us-east-1",
          "us-east-2",
          "us-west-1",
          "us-west-2",
          "cn-north-1",
          "cn-northwest-1",
          "us-gov-east-1",
          "us-gov-west-1",
          "us-iso-east-1",
          "us-iso-west-1",
          "us-isob-east-1",
        ],
      },
      aws_auto_create_queue: {
        title: "Autocreate Queue",
        description: "Setting the autocreation of the SQS queue.",
        type: "boolean",
        default: false,
      },
      aws_amazon_a_w_s_host: {
        title: "AWS Host",
        description: "The hostname of the Amazon AWS cloud.",
        type: "string",
        default: "amazonaws.com",
      },
      aws_protocol: {
        title: "Protocol",
        description: "The underlying protocol used to communicate with SQS",
        type: "string",
        enum: ["http", "https"],
        default: "https",
      },
      aws_queue_u_r_l: {
        title: "Queue URL",
        description: "The full SQS Queue URL (required if using KEDA)",
        type: "string",
      },
      aws_uri_endpoint_override: {
        title: "Overwrite Endpoint URI",
        description:
          "Set the overriding endpoint URI. This option needs to be used in combination with overrideEndpoint option.",
        type: "string",
      },
      aws_override_endpoint: {
        title: "Endpoint Overwrite",
        description:
          "Set the need for overiding the endpoint URI. This option needs to be used in combination with uriEndpointOverride setting.",
        type: "boolean",
        default: false,
      },
      aws_delay: {
        title: "Delay",
        description: "Milliseconds before the next poll of the selected stream",
        type: "integer",
        default: 500,
      },
    },
  },
  "slack_source_0.1": {
    type: "object",
    additionalProperties: false,
    required: ["slack_channel", "slack_token"],
    properties: {
      slack_channel: {
        title: "Channel",
        description: "The Slack channel to receive messages from",
        type: "string",
        example: "#myroom",
      },
      slack_token: {
        title: "Token",
        "x-group": "credentials",
        oneOf: [
          {
            title: "Token",
            description:
              "The token to access Slack. A Slack app is needed. This app needs to have channels:history and channels:read permissions. The Bot User OAuth Access Token is the kind of token needed.",
            type: "string",
            format: "password",
          },
          {
            description: "An opaque reference to the slack_token",
            type: "object",
            properties: {},
          },
        ],
      },
      slack_delay: {
        title: "Delay",
        description: "The delay between polls",
        type: "string",
        example: "1s",
      },
      kafka_topic: {
        title: "Topic Names",
        description: "Comma separated list of Kafka topic names",
        type: "string",
      },
    },
  },
  "google_pubsub_source_0.1": {
    type: "object",
    additionalProperties: false,
    required: [
      "gcp_project_id",
      "gcp_subscription_name",
      "gcp_service_account_key",
    ],
    properties: {
      gcp_project_id: {
        title: "Project Id",
        description: "The Google Cloud PubSub Project Id",
        type: "string",
      },
      gcp_subscription_name: {
        title: "Subscription Name",
        description: "The Subscription Name",
        type: "string",
      },
      gcp_service_account_key: {
        title: "Service Account Key",
        description:
          "The Service account key that can be used as credentials for the PubSub publisher/subscriber",
        type: "string",
        "x-group": "credentials",
        format: "base64",
      },
      gcp_synchronous_pull: {
        title: "Synchronous Pull",
        description:
          "If Synchronously pull batches of messages is enabled or not",
        type: "boolean",
        default: false,
      },
      gcp_max_messages_per_poll: {
        title: "Max Messages Per Poll",
        description:
          "The max number of messages to receive from the server in a single API call",
        type: "integer",
        default: 1,
      },
      gcp_concurrent_consumers: {
        title: "Concurrent Consumers",
        description:
          "The number of parallel streams consuming from the subscription",
        type: "integer",
        default: 1,
      },
    },
  },
};
