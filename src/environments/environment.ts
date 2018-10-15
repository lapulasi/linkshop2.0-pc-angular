// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // service_url: 'http://localhost:9090',
  service_url: 'https://service.linkshop.avc-sz.com:8444',
  // service_url: 'http://192.168.1.148:9090',
  pre_img_url: 'http://avc-test.oss-cn-shenzhen.aliyuncs.com/'
};
