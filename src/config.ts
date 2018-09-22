// typing implementation of CONFIG to make it work with AOT
declare const CONFIG: {
  env: string,
  apiEndpoint: string,
  sentryDSN: string,
  serverLogUrl: string,
  intercomAppId: string,
  mixpanelToken: string,
  gaTrackingId: string,
  ropstenURL: string,
  contractAddress: string
};

export default CONFIG;
