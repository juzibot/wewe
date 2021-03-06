const { dynamodb, docClient } = require('./index');

async function createTable() {
  console.log('going to create "wewe-group" table');
  await dynamodb.createTable({
    TableName: 'wewe-group',
    KeySchema: [
      { AttributeName: 'name', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'name', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  }).promise();
  console.log('successfully created table "wewe-group"');
}

async function deleteTable() {
  await dynamodb.deleteTable({ TableName: 'wewe-group' }).promise();
}

async function get({ name }) {
  const { Item } = await docClient.get({
    TableName: 'wewe-group',
    Key: {
      name,
    },
  }).promise();
  return Item;
}

// 直接用群聊名作为 id 的问题:
//   con: 名字不能重复
//   con: 无法改名, 或者说麻烦: 要对所有 msg 做 migration; 也可以不改, 改名: 两个 wewe-group 合成一个
//   con: 无法得知群聊总数
//   pro: 插入 msg 时不用管
// 与群聊名无关的 id:
//   pro: 相同名字微信群也可支持
//   pro: 微信群改名方便
//   pro: id 如果是数字, 可以拿到群聊总数
//   con: 插入 msg 时需要查询 msg 所在 wewe-group id
//   con: 查询 msg 所在 wewe-group 时仍需要防止同名
//   con: 只有微信需要用到这个!
async function getAll() {
  const { Items } = await docClient.scan({
    TableName: 'wewe-group',
  }).promise();
  return Items.reverse();
}

async function put({
  name, description, logoUrl, type, userCount, msgCount, topicCount,
}) {
  await docClient.put({
    TableName: 'wewe-group',
    Item: {
      name, description, logoUrl, type, userCount, msgCount, topicCount,
    },
  }).promise();
}

async function incMsgCount({ name }) {
  const res = await docClient.update({
    TableName: 'wewe-group',
    Key: { name },
    AttributeUpdates: {
      msgCount: {
        Action: 'ADD',
        Value: 1,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  }).promise();
  return res.Attributes.msgCount;
}

async function incTopicCount({ name }) {
  const res = await docClient.update({
    TableName: 'wewe-group',
    Key: { name },
    AttributeUpdates: {
      topicCount: {
        Action: 'ADD',
        Value: 1,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  }).promise();
  return res.Attributes.topicCount;
}

async function incMsgCountByN({ name, n }) {
  const res = await docClient.update({
    TableName: 'wewe-group',
    Key: { name },
    AttributeUpdates: {
      msgCount: {
        Action: 'ADD',
        Value: n,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  }).promise();
  return res.Attributes.msgCount;
}

module.exports = {
  createTable,
  deleteTable,
  get,
  getAll,
  put,
  incMsgCount,
  incMsgCountByN,
  incTopicCount,
};

// put({
//   name: 'wewe',
//   description: 'Building wewe together',
//   logoUrl: 'https://user-images.githubusercontent.com/5512552/58616555-87959580-82f0-11e9-8ac4-4045463f2f41.png',
//   type: 'wechat',
//   userCount: 3,
//   msgCount: 0,
//   topicCount: 0,
// });
