import os
import socketio
import time
import importlib

SOCKET_SERVER_URL = os.getenv('SOCKET_SERVER_URL', 'http://localhost:3002')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
print(OPENAI_API_KEY)

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')

@sio.event
def disconnect():
    print('Disconnected from server')

@sio.on('ai_task')
def process_request(data):
    print("Received task")
    agent_type = data['agent_type']
    input_data = data['input']
    user_id = data['user_id']
    agent_config = data.get('agent_config', {})
    task_id = data['task_id']

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

        response = {'result': result, 'task_id': task_id}
    except Exception as e:
        response = {'error': str(e), 'task_id': task_id}

    sio.emit('ai_result', response)


def main():
    while True:
        try:
            sio.connect(SOCKET_SERVER_URL)
            sio.wait()
        except Exception as e:
            print(f"Connection error: {e}")
            time.sleep(5)

if __name__ == '__main__':
    main()
