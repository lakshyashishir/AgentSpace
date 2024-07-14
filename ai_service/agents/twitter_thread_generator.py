from crewai import Agent, Task, Crew
from tools.text_processing_tools import summarize_text, generate_tweet_text
from tools.twitter_tools import format_twitter_thread

def create_agent(config):
    researcher = Agent(
        role='Researcher',
        goal='Extract key points from given content',
        backstory='You are an AI research assistant specialized in content analysis',
        tools=[summarize_text]
    )
    
    writer = Agent(
        role='Twitter Thread Writer',
        goal='Create engaging Twitter threads',
        backstory='You are an AI writing assistant that excels at crafting viral Twitter content',
        tools=[generate_tweet_text, format_twitter_thread]
    )

    task1 = Task(
        description='Analyze the input content and extract key points',
        agent=researcher
    )

    task2 = Task(
        description='Create a Twitter thread based on the key points',
        agent=writer
    )

    crew = Crew(
        agents=[researcher, writer],
        tasks=[task1, task2],
        verbose=True
    )

    return crew