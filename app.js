const koa = require('koa') // koa@2 
const koaRouter = require('koa-router') // koa-router@next 
const koaBody = require('koa-bodyparser') // koa-bodyparser@next 
const {
  ApolloServer,
  gql
} = require('apollo-server-koa');
const render = require('koa-swig')
const co = require('co')
const serve = require('koa-static')

const data = [{
    "id": "1",
    "name": "Jerry",
    "age": 20
  },
  {
    "id": "2",
    "name": "Tom",
    "age": 21
  },
  {
    "id": "3",
    "name": "Spike",
    "age": 22
  }
]

// Construct a schema, using GraphQL schema language
const typeDefs = gql `
  type Query {
    user(id: ID!): User
  }
  type User {
    id: String
    name: String
    age: Int
  }
  type Mutation {
    updateUser (
      userId: ID!,
      name: String
    ): User
  }

  # we need to tell the server which types represent the root query
  # 如果省略，则默认会使用Query Type作为root query
  schema {
    query: Query
    mutation: Mutation
  }
`;

// client graphql:
// mutation UpdateUser {
//   updateUser(
//     userId: 1
//     name: "Ranjay"
//   ){
//     name
//     age
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

// Provide resolver functions for your schema fields
// 每个resolvers会传入四个参数：
//1⃣️obj: 上一级对象，如果字段属于根节点则为undefined。(常用)
//2⃣️args: 可以提供在 GraphQL 查询中传入的参数，即查询条件。(常用)
//3⃣️context: 会被提供给所有解析器，并且持有重要的上下文信息比如当前登入的用户或者数据库访问对象。
//4⃣️info: 一个保存与当前查询相关的字段特定信息以及 schema 详细信息的值，
const resolvers = {
  Query: {
    user: (_, args) => {
      return data[args.id]
    }
  },
  Mutation: {
    updateUser(_, user) {
      // { userId: '1', name: 'Ranjay' }
      console.log(user)
    }
  }
}

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers
});

const app = new koa();
const router = new koaRouter();
const PORT = 3000;
app.use(serve('./')); // 静态资源文件
app.context.render = co.wrap(render({
  root: './',
  autoescape: true,
  cache: 'memory', // disable, set to false
  ext: 'html',
  varControls: ['[[', ']]'],
  writeBody: false
}));
// koaBody is needed just for POST. 
app.use(koaBody());
graphqlServer.applyMiddleware({
  app
})
router.get('/', async ctx => ctx.body = await ctx.render('index'));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT + graphqlServer.graphqlPath}`)
});