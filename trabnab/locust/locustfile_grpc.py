from locust import User, task, between
import grpc
import music_service_pb2
import music_service_pb2_grpc

class GrpcUser(User):
    wait_time = between(1, 2)

    def on_start(self):
        self.channel = grpc.insecure_channel('localhost:50051')
        self.stub = music_service_pb2_grpc.UserServiceStub(self.channel)

    @task(2)
    def get_users(self):
        self.stub.ListUsers(music_service_pb2.Empty())

    @task(1)
    def create_user(self):
        user = music_service_pb2.User(id='test_id', name='Test User', age=30)
        self.stub.CreateUser(user)
