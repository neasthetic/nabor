from locust import HttpUser, task, between

class GraphQLUser(HttpUser):
    wait_time = between(1, 2)

    @task(2)
    def get_users(self):
        query = '''
        {
            users {
                id
                name
                age
            }
        }
        '''
        self.client.post("/graphql", json={"query": query})

    @task(1)
    def create_user(self):
        mutation = '''
        mutation {
            createUser(userInput: { name: "Test User", age: 30 }) {
                id
                name
                age
            }
        }
        '''
        self.client.post("/graphql", json={"query": mutation})
