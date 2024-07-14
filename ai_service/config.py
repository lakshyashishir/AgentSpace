# config.py
import os

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
RABBITMQ_URL = os.environ.get('RABBITMQ_URL', 'localhost')