from crewai import Agent, Task, Crew
from tools.youtube_tools import fetch_transcript, analyze_video
from tools.text_processing_tools import summarize_text, generate_blog_post

def create_agent(config):
    researcher = Agent(
        role='Researcher',
        goal='Analyze YouTube video content',
        backstory='You are an AI research assistant specialized in video content analysis',
        tools=[fetch_transcript, analyze_video]
    )
    
    writer = Agent(
        role='Writer',
        goal='Create engaging blog posts from video content',
        backstory='You are an AI writing assistant that excels at creating blog content',
        tools=[summarize_text, generate_blog_post]
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