import json
import importlib
import pika
from pika.exceptions import AMQPConnectionError
import time
import os

RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672/%2F')
QUEUE_NAME = os.getenv('QUEUE_NAME', 'ai_tasks')

def process_request(ch, method, properties, body):
    request = json.loads(body)
    agent_type = request['agent_type']
    input_data = request['input']
    agent_config = request.get('agent_config', {})

    try:
        agent_module = importlib.import_module(f'agents.{agent_type}')
        agent = agent_module.create_agent(agent_config)
        
        # Check if the agent is a Crew AI agent or a LangChain agent
        if hasattr(agent, 'run'):
            # Crew AI agent
            result = agent.run(input_data)
        else:
            # LangChain agent
            result = agent(input_data)

        response = {'result': result}
    except Exception as e:
        response = {'error': str(e)}

    ch.basic_publish(
        exchange='',
        routing_key=properties.reply_to,
        properties=pika.BasicProperties(correlation_id=properties.correlation_id),
        body=json.dumps(response)
    )
    ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
    while True:
        try:
            connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue=QUEUE_NAME, on_message_callback=process_request)

            print(f" [*] Waiting for messages in queue '{QUEUE_NAME}'. To exit press CTRL+C")
            channel.start_consuming()
        except AMQPConnectionError:
            print("Connection was closed, retrying...")
            time.sleep(5)
        except KeyboardInterrupt:
            print("Interrupted")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            time.sleep(5)

if __name__ == '__main__':
    main()