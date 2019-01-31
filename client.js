import Lokka from 'lokka';
import Transport from 'lokka-transport-http';
const client = new Lokka({
  transport: new Transport('http://localhost:3000/graphql')
});
const dataInfo = client.createFragment(`
  fragment on User {
    name,
    age
  }
`);
client.query(`
  {
       user(id: 1) {
        ...${dataInfo}
      }
  }
`).then(result => {
  console.log(result);
});