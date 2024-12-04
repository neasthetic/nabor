from locust import User, task, between
from zeep import Client

class SoapUser(User):
    wait_time = between(1, 2)

    def on_start(self):
        self.client = Client('http://localhost:8000/userwsdl?wsdl')

    @task(2)
    def get_users(self):
        self.client.service.ListUsers()

    @task(1)
    def create_user(self):
        user_data = {
            'id': 'test_id',
            'name': 'Test User',
            'age': 30,
            'playlists': []
        }
        self.client.service.CreateUser(user=user_data)
