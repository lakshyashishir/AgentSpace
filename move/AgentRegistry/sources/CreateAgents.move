script {
    use AgentSpace::AgentRegistry;
    use std::string;

    fun create_agents(creator: &signer) {
        AgentRegistry::create_agent(
            creator,
            string::utf8(b"4d39358c-4812-43c0-94f0-51551564ae0e"),
            string::utf8(b"Sentiment Analyzer"),
            string::utf8(b"Analyze the sentiment of given text, determining if it's positive, negative, or neutral using LangChain."),
            string::utf8(b"langchain"),
            150000000, // 150 AGCN (assuming 6 decimal places)
            10000000  // 10 AGCN execution cost
        );

        AgentRegistry::create_agent(
            creator,
            string::utf8(b"af13bc2d-8aa1-4cd3-822d-b683968206d5"),
            string::utf8(b"Article Summarizer"),
            string::utf8(b"This agent uses LangChain to summarize articles into concise, easy-to-read summaries."),
            string::utf8(b"langchain"),
            100000000, // 100 AGCN
            10000000  // 10 AGCN execution cost
        );

        AgentRegistry::create_agent(
            creator,
            string::utf8(b"ccfa4119-0766-4879-a34b-685c59622ec5"),
            string::utf8(b"YouTube to Blog Converter"),
            string::utf8(b"Convert YouTube video content into well-structured blog posts using LangChain."),
            string::utf8(b"crew"),
            250000000, // 250 AGCN
            20000000  // 20 AGCN execution cost
        );

        AgentRegistry::create_agent(
            creator,
            string::utf8(b"f66de9bd-751c-4e6a-b7c9-635f7c76c610"),
            string::utf8(b"Twitter Thread Generator"),
            string::utf8(b"Generate engaging Twitter threads on various topics using LangChain."),
            string::utf8(b"crew"),
            200000000, // 200 AGCN
            15000000  // 15 AGCN execution cost
        );
    }
}