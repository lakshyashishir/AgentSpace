from langchain import LLMChain, PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains.summarize import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter

def create_agent(config):
    llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo-16k")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000,
        chunk_overlap=200,
    )

    summarize_chain = load_summarize_chain(llm, chain_type="map_reduce")

    key_points_template = """
    Given the following text, extract the 5 most important key points:

    {text}

    KEY POINTS:
    1.
    """
    key_points_prompt = PromptTemplate(template=key_points_template, input_variables=["text"])
    key_points_chain = LLMChain(llm=llm, prompt=key_points_prompt)

    tldr_template = """
    Given the following summary and key points, create a concise TL;DR (Too Long; Didn't Read) version:

    Summary: {summary}

    Key Points:
    {key_points}

    TL;DR:
    """
    tldr_prompt = PromptTemplate(template=tldr_template, input_variables=["summary", "key_points"])
    tldr_chain = LLMChain(llm=llm, prompt=tldr_prompt)

    def run(article):
        chunks = text_splitter.split_text(article)

        summary = summarize_chain.run(chunks)

        key_points = key_points_chain.run(summary)

        tldr = tldr_chain.run(summary=summary, key_points=key_points)

        return {
            "summary": summary,
            "key_points": key_points,
            "tldr": tldr
        }

    return run