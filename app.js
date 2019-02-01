const koa = require('koa') // koa@2 
const koaRouter = require('koa-router') // koa-router@next 
const koaBody = require('koa-bodyparser') // koa-bodyparser@next 
const render = require('koa-swig')
const co = require('co')
const serve = require('koa-static')

const {
  ApolloServer,
} = require('apollo-server-koa');
const typeDefs = require('./graphql/schema') 
const resolvers = require('./graphql/resolvers')
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
// connect graphql
graphqlServer.applyMiddleware({
  app
})
router.get('/', async ctx => ctx.body = await ctx.render('index'));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT + graphqlServer.graphqlPath}`)
});