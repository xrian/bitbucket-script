/**
 * Created by zhangsong on 2018/11/1.
 */

const express = require('express');
const router = express.Router();
const request = require('../utils/request');
const config = require('../config/config');

router.get('/:project', async function (req, res, next) {
  const { project } = req.params;
  try {
    const token = await request.getToken();
    const result = await request.getRepoByProject({
      user: config.bitBucketUser,
      project,
      token: token.access_token,
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status = e.status;
    res.send(e.message);
  }
});

router.get('/branch/:uuid', async function (req, res, next) {
  const { uuid } = req.params;
  try {
    const token = await request.getToken();
    const result = await request.listAllBranch({
      user: config.bitBucketUser,
      slug: uuid,
      token: token.access_token,
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status = e.status;
    res.send(e.message);
  }
});

router.post('/branch/:uuid', async function (req, res, next) {
  const { uuid } = req.params;
  const { hash, name } = req.body;
  if(!hash){
    res.status = 500;
    return res.send('请选择源分支');
  }
  try {
    const token = await request.getToken();
    const result = await request.addBranch({
      user: config.bitBucketUser,
      slug: uuid,
      token: token.access_token,
      body: {
        hash,
        name,
      }
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status = e.status;
    res.send(e.message);
  }
});

router.post('/branch/:uuid/lock', async function (req, res, next) {
  const { uuid } = req.params;
  const { name } = req.body;
  if(!name){
    res.status = 500;
    return res.send('请选择需要锁定的分支');
  }
  const token = await request.getToken();

  const rule = createRule(name);

  const arr = rule.map((item)=> {
    return request.lockBranch({
      user: config.bitBucketUser,
      slug: uuid,
      token: token.access_token,
      body: item,
    });
  });
  try {
    const result = await Promise.all(arr);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status = e.status;
    res.send(e.message);
  }
});

module.exports = router;

function createRule(name) {
  return [
    {
      "kind": "push",
      "pattern": name,
      "users": [],
      "groups": []
    },
    {
      "kind": "restrict_merges",
      "pattern": name,
      "users": [],
      "groups": []
    },
    {
      "kind": "delete",
      "pattern": name
    },
    {
      "kind": "force",
      "pattern": name
    }
  ];
}
