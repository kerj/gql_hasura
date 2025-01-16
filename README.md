# gql_hasura

This repository provides a streamlined setup for integrating GraphQL with Hasura to build modern, real-time applications. The project focuses on efficient data management, automatic GraphQL schema generation, and real-time updates, leveraging Hasura's powerful features.

## Features

- **Instant GraphQL API**: Automatically generates a fully-functional GraphQL API over your database.
- **Real-Time Subscriptions**: Enables live updates as data changes.
- **Flexible Configuration**: Easily customize to suit your project's requirements.
- **Built for Developers**: Simplifies the setup of GraphQL APIs with minimal boilerplate.

## Prerequisites

Before setting up this project, ensure the following tools are installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (optional for additional custom scripts)

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the Repository

```bash
git clone https://github.com/kerj/gql_hasura.git
cd gql_hasura
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```env
HASURA_GRAPHQL_DATABASE_URL=postgres://username:password@host:port/database
HASURA_GRAPHQL_ADMIN_SECRET=your_admin_secret
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_DEV_MODE=true
```

Replace the placeholder values with your actual database credentials and desired admin secret.

### 3. Start the Hasura and PostgreSQL Containers

Use Docker Compose to start the Hasura and PostgreSQL containers:

```bash
docker-compose up -d
```

This will start both the Hasura GraphQL Engine and the PostgreSQL database.

### 4. Access the Hasura Console

Once the containers are running, you can access the Hasura Console by navigating to:

```
http://localhost:8080
```

Log in using the `HASURA_GRAPHQL_ADMIN_SECRET` you set in the `.env` file.

### 5. Apply Migrations (Optional)

If your project includes database migrations, apply them using the Hasura CLI:

```bash
hasura migrate apply
hasura metadata apply
```

### 6. Explore the GraphQL API

Start building and testing your queries, mutations, and subscriptions using the GraphQL API endpoint:

```
http://localhost:8080/v1/graphql
```

## Troubleshooting

- **Docker Issues**: Ensure Docker and Docker Compose are properly installed and running.
- **Environment Variables**: Double-check your `.env` file for any errors in database credentials or admin secret.
- **Access Issues**: Verify that port `8080` is open and not blocked by a firewall.

## Contributing

Contributions are welcome! If you'd like to improve this repository, please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding!


# A flexible Data table and Data Context provider

Wrap your components with the DataProvider component and provide type safety at the same time!
```
 <div className="App">
      <DataProvider<ContextType> requestMetas={{
        url: "Some endpoint",
        options: {
          method: "post",
          data: JSON.stringify({
            query: `
              query GetCustomers {
                customers(limit: 19, where: {first_name: {_like: "Le%"}}) {
                  email_address
                  first_name
                  last_name
                }
              }
            `,
            operationName: "GetCustomers"
          })
        }
      }}>
        <Display />
      </DataProvider>
```

The data Provider uses the requestMetas provided: 

```
   const result = await axios(requestMetas.url, { ...requestMetas.options, signal }).then(res => {
        return res.data
      });
```

DataProvider exposes a `setStale` method that will allow components in the tree to let the context know
that the data it is providing is stale and should refetch! 
