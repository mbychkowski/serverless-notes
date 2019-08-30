const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "serverless-notes-api-dev-attachmentsbucket-1ejxz0xkjfzm3"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.bychnotes.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_aL6XHJ7T6",
    APP_CLIENT_ID: "1h5vof877gdm259slset3tmqhr",
    IDENTITY_POOL_ID: "us-east-1:b692295f-1a19-4635-a55c-f68ca83c06c3"
  }
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "serverless-notes-api-prod-attachmentsbucket-2ygsxny2jtba"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.bychnotes.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_P2sUqN2Fk",
    APP_CLIENT_ID: "1n0lp82jmir226i774v2qhur6t",
    IDENTITY_POOL_ID: "us-east-1:48026ead-e14f-4392-ba58-a702996ed100"
  }
}

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
}