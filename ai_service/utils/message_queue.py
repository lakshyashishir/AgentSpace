import pika
import json
from config import RABBITMQ_URL

class MessageQueue:
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue='ai_tasks')

    def consume(self, callback):
        self.channel.basic_consume(queue='ai_tasks', on_message_callback=callback, auto_ack=True)
        self.channel.start_consuming()

    def publish_response(self, response, reply_to, correlation_id):
        self.channel.basic_publish(
            exchange='',
            routing_key=reply_to,
            properties=pika.BasicProperties(correlation_id=correlation_id),
            body=response
        )