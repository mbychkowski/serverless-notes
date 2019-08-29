export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-n1l2sadf"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://y4vvt87e4e.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_RL61I6hFY",
    APP_CLIENT_ID: "64ao951jo361bu6f4su07birjn",
    IDENTITY_POOL_ID: "us-east-1:0870fc78-fcfb-4170-8126-f75d21aa9bf5"
  }
};
