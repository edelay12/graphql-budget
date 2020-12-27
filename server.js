const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLFloat
} = require('graphql');
const knex = require("knex");
const { DATABASE_URL } = require("./config");
const cors = require("cors");

const app = express()
app.use(cors());

const db = knex({
  client: "pg",
  connection: DATABASE_URL
});

app.set("db", db);



//custom type
// const authorType = new GraphQLObjectType({
//     name: 'author',
//     description: 'an author',
//     fields: () => ({
//         id: {type: GraphQLNonNull(GraphQLInt)},
//         name: {type: GraphQLString},
//         books: {
//             type: new GraphQLList(bookType),
//         resolve: (author) => {
//             return booksList.filter(book => book.authorId === author.id) 
//         }
//     }
//     })
// });

const expenseType = new GraphQLObjectType({
    name: 'expense',
    description: 'user expense',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        expense_name: {type: GraphQLString},
        expense_name: {type: GraphQLString},
        amount: {type: GraphQLFloat},
        user_id: {type: GraphQLNonNull(GraphQLInt)},
        // author : {
        //     type: authorType,
        //     resolve: (book) => {
        //         return authors.find(author => book.authorId === author.id)
        //     }
        // }
    })
})


const rootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'all mutations object',
    fields: () => ({
        addExpense: {
            type: expenseType,
            description: 'add an expense',
            args : {
            name: {type: GraphQLNonNull(GraphQLString) },
            amount: {type:GraphQLNonNull(GraphQLInt)},
            category: {type: GraphQLNonNull(GraphQLString) }
        },
     resolve: (parent, args) => {
         const newExpense = { expense_name: args.name, category: args.category, amount: args.amount }
        return db
      .insert(newExpense)
      .into("expenses")
      .returning("*")
      .then(([expense]) => expense);
     }
    // addBook: {
    //      type: bookType,
    //      description: "add a book",
    //      args: { 
    //          title: { type: GraphQLNonNull(GraphQLString) },
    //          authorId: {type: GraphQLNonNull(GraphQLInt)}
    //      },
    //      resolve: (parent, args) => {
    //          const book = { id: booksList.length + 1, title: args.title, authorId: args.authorId}
    //          booksList.push(book);
    //          console.log(booksList)
    //          return book;
    //      }
    // }
    }
})
}) 

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'root query',
    fields: () => ({
        expense: {
            type: expenseType,
            description: 'An expenses',
            args: { 
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                //query database or other data to return 
                return db.from("expenses").select("*").where({ id : args.id });
            }
         } ,
        expenses: {
            type: GraphQLList(expenseType),
            description: 'List of expenses',
            resolve: () => {
                //query database or other data to return 
                // return booksList;
                return db.from("expenses")
                .select("*")
                // .where({ id: teamId })
                // .first()
                // .then(team => {
                //   console.log(team)
                //   return team.team_name;
                // });
                    } 
        },
        expenses: {
            type: GraphQLList(expenseType),
            description: 'List of expenses',
            resolve: () => {
                //query database or other data to return 
                // return booksList;
                return db.from("expenses")
                .select("*")
                // .where({ id: teamId })
                // .first()
                // .then(team => {
                //   console.log(team)
                //   return team.team_name;
                // });
                    } 
        },
        // authors: {
        //     type: GraphQLList(authorType),
        //     description: 'List of authors',
        //     resolve: () => {
        //         //query database or other data to return 
        //         return authors;
        //     } 
        // }
    })
})

//schema
schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: rootMutationType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(5000., () => console.log('server listening'))

