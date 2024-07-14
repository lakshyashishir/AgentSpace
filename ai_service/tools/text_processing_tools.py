from langchain.chat_models import ChatOpenAI
from langchain import PromptTemplate, LLMChain

llm = ChatOpenAI(temperature=0.7)

def summarize_text(text):
    prompt = PromptTemplate(
        input_variables=["text"],
        template="Summarize the following text:\n\n{text}\n\nSummary:"
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    return chain.run(text)

def generate_blog_post(content):
    prompt = PromptTemplate(
        input_variables=["content"],
        template="Create a blog post based on the following content:\n\n{content}\n\nBlog Post:"
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    return chain.run(content)

def generate_tweet_text(content):
    prompt = PromptTemplate(
        input_variables=["content"],
        template="Create a tweet based on the following content:\n\n{content}\n\nTweet:"
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    return chain.run(content)