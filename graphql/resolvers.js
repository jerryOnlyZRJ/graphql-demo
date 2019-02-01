const data = require('../models')

// Provide resolver functions for your schema fields
// 每个resolvers会传入四个参数：
//1⃣️obj: 上一级对象，如果字段属于根节点则为undefined。(常用)
//2⃣️args: 可以提供在 GraphQL 查询中传入的参数，即查询条件。(常用)
//3⃣️context: 会被提供给所有解析器，并且持有重要的上下文信息比如当前登入的用户或者数据库访问对象。
//4⃣️info: 一个保存与当前查询相关的字段特定信息以及 schema 详细信息的值，
module.exports = {
    Query: {
      user: (_, args) => {
        return data[args.id]
      }
    },
    Mutation: {
      updateUser(_, args) {
        // { userId: '1', name: 'Ranjay' }
        console.log(args)
        return data[args.userId]
      }
    }
  }

// client graphql:
// mutation UpdateUser {
//   updateUser(
//     userId: 1
//     name: "Ranjay"
//   ){
//     ...userInfo
//   }
// }

// fragment userInfo on User {
//   name
//   age
// }
// query getUserInfo {
//   user(id: 1) {
//     ...userInfo
//   }
// }
  