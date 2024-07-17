from crewai import Agent, Task, Crew
from langchain.llms import OpenAI
from tools.youtube_tools import fetch_transcript, analyze_video
from tools.text_processing_tools import summarize_text, generate_blog_post

def create_agent(config):
    openai_api_key = config.get('openai_api_key')
    llm = OpenAI(temperature=0.7, openai_api_key=openai_api_key)

    researcher = Agent(
        role='Researcher',
        goal='Analyze YouTube video content',
        backstory='You are an AI research assistant specialized in video content analysis',
        tools=[fetch_transcript, analyze_video],
        llm=llm
    )
    
    writer = Agent(
        role='Writer',
        goal='Create engaging blog posts from video content',
        backstory='You are an AI writing assistant that excels at creating blog content',
        tools=[summarize_text, generate_blog_post],
        llm=llm
    )

    task1 = Task(
        description='Fetch and analyze the YouTube video',
        agent=researcher
    )

    task2 = Task(
        description='Create a blog post based on the video analysis',
        agent=writer
    )

    crew = Crew(
        agents=[researcher, writer],
        tasks=[task1, task2],
        verbose=True
    )

    return crew