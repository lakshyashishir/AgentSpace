from langchain import LLMChain, PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import SequentialChain

def create_agent(config):
    llm = ChatOpenAI(temperature=0.7, model_name="gpt-3.5-turbo")

    sentiment_template = """
    Analyze the sentiment of the following text. Provide a sentiment label (positive, negative, or neutral) and a confidence score from 0 to 1.

    Text: {text}

    Sentiment Analysis:
    Label:
    Confidence:
    """
    sentiment_prompt = PromptTemplate(template=sentiment_template, input_variables=["text"])
    sentiment_chain = LLMChain(llm=llm, prompt=sentiment_prompt, output_key="sentiment_analysis")

    key_phrases_template = """
    Extract the top 5 key phrases from the following text:

    Text: {text}

    Key Phrases:
    1.
    """
    key_phrases_prompt = PromptTemplate(template=key_phrases_template, input_variables=["text"])
    key_phrases_chain = LLMChain(llm=llm, prompt=key_phrases_prompt, output_key="key_phrases")

    report_template = """
    Generate a comprehensive report based on the sentiment analysis and key phrases:

    Sentiment Analysis: {sentiment_analysis}
    Key Phrases: {key_phrases}

    Report:
    """
    report_prompt = PromptTemplate(template=report_template, input_variables=["sentiment_analysis", "key_phrases"])
    report_chain = LLMChain(llm=llm, prompt=report_prompt, output_key="report")

    sentiment_analysis_chain = SequentialChain(
        chains=[sentiment_chain, key_phrases_chain, report_chain],
        input_variables=["text"],
        output_variables=["sentiment_analysis", "key_phrases", "report"],
        verbose=True
    )

    def run(text):
        result = sentiment_analysis_chain({"text": text})
        return result

    return run