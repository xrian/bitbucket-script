/**
 * Created by zhangsong on 2018/11/1.
 */
const request = require('superagent');
const config = require('../config/config');
let TOKEN = null;

const API = {
  host: 'https://api.bitbucket.org',
  getRepoByUser: '/2.0/repositories/@USER',
  getTokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
  listAllBranch: '/2.0/repositories/@USER/@SLUG/refs/branches',
  addBranch: '/2.0/repositories/@USER/@SLUG/refs/branches',
  branchRestrictions: '/2.0/repositories/@USER/@SLUG/branch-restrictions',
};

/**
 * 获取token
 * @param clientId
 * @param secret
 * @param username
 * @param password
 * @return {Promise<*>}
 */
async function getApiToken({
  clientId,
  secret,
  username,
  password,
}) {
  const response = await request.post(API.getTokenUrl).auth(clientId, secret, { type: 'auto' }).type('form').send({
    grant_type: 'client_credentials',
    username,
    password,
  });
  const token = response.body;
  TOKEN = token;
  return token;
}

/**
 * 获取某个项目下全部的仓库
 * @param user
 * @param project
 * @param token
 * @return {Promise<*>}
 */
async function getRepoByProject({
  user = '',
  project = '',
  token = '',
}) {
  const url = API.host + API.getRepoByUser.replace('@USER', user);
  const response = await request.get(url).set({
    Authorization: `Bearer ${token}`,
  }).query({
    pagelen: 100, // 每页显示条数
    fields: 'values.uuid,values.links,values.name,values.description,pagelen,page,size', // 过滤
    q: 'project.key="' + project + '"',
  });
  return response.body;
}

/**
 * 获取某个仓库的全部分支
 * @param user
 * @param slug
 * @param token
 * @return {Promise<*>}
 */
async function listAllBranch({
  user = '',
  slug = '',
  token = '',
}) {
  const url = API.host + API.listAllBranch.replace('@USER', user).replace('@SLUG', slug);
  const response = await request.get(url)
    .set({
      Authorization: `Bearer ${token}`,
    })
    .query({
      pagelen: 100,
      fields: 'pagelen,values.name,values.links,values.type,values.target.hash,values.target.date',
    });
  return response.body;
}

/**
 * 新增分支
 * @return {Promise<void>}
 */
async function addBranch({
  user = '',
  slug = '',
  body,
  token = '',
}) {
  const url = API.host + API.listAllBranch.replace('@USER', user).replace('@SLUG', slug);
  const response = await request.post(url)
    .set({
      Authorization: `Bearer ${token}`,
    }).send({
      name: body.name,
      target: {
        hash: body.hash,
      },
    });
  return response.body;
}

async function lockBranch({
  user = '',
  slug = '',
  body,
  token = '',
}) {
  const url = API.host + API.branchRestrictions.replace('@USER', user).replace('@SLUG', slug);
  const response = await request.post(url)
    .set({
      Authorization: `Bearer ${token}`,
    }).send(body).type('json');
  return response.body;
}

async function getToken() {
  if (TOKEN === null) {
    let token = await getApiToken({
      clientId: config.token.clientId,
      secret: config.token.secret,
      username: config.token.username,
      password: config.token.password,
    });
    TOKEN = token;
    setTimeout(() => {
      token = null;
    }, 90 * 60 * 1000);
    return token;
  } else {
    return TOKEN;
  }
}

module.exports = {
  getApiToken,
  getRepoByProject,
  listAllBranch,
  getToken,
  addBranch,
  lockBranch,
};
