from locust import HttpUser, task, between

class RestUser(HttpUser):
    wait_time = between(1, 2)

    @task(2)
    def get_users(self):
        self.client.get("/users")

    @task(1)
    def create_user(self):
        self.client.post("/users", json={"name": "Test User", "age": 30})
