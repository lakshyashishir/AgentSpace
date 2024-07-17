module AgentSpace::AgentManager {
    use AgentSpace::AgentRegistry;
    use std::string;
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::event;

    struct AgentManagerData has key {
        initialized: bool,
        create_agent_events: event::EventHandle<CreateAgentEvent>,
    }

    struct CreateAgentEvent has drop, store {
        agent_id: string::String,
    }

    public entry fun initialize(account: &signer) {
        if (!exists<AgentManagerData>(signer::address_of(account))) {
            move_to(account, AgentManagerData { 
                initialized: true,
                create_agent_events: account::new_event_handle<CreateAgentEvent>(account),
            });
            AgentRegistry::initialize(account);
        };
    }

    public entry fun create_predefined_agents(creator: &signer) acquires AgentManagerData {
        let creator_address = signer::address_of(creator);
        assert!(exists<AgentManagerData>(creator_address), 1000);
        let manager_data = borrow_global_mut<AgentManagerData>(creator_address);
        assert!(manager_data.initialized, 1001);

        create_agent(creator, b"4d39358c-4812-43c0-94f0-51551564ae0e", b"Sentiment Analyzer", b"Analyze the sentiment of given text, determining if it's positive, negative, or neutral using LangChain.", b"langchain", 150000000, 10000000, &mut manager_data.create_agent_events);
        create_agent(creator, b"af13bc2d-8aa1-4cd3-822d-b683968206d5", b"Article Summarizer", b"This agent uses LangChain to summarize articles into concise, easy-to-read summaries.", b"langchain", 100000000, 10000000, &mut manager_data.create_agent_events);
        create_agent(creator, b"ccfa4119-0766-4879-a34b-685c59622ec5", b"YouTube to Blog Converter", b"Convert YouTube video content into well-structured blog posts using LangChain.", b"crew", 250000000, 20000000, &mut manager_data.create_agent_events);
        create_agent(creator, b"f66de9bd-751c-4e6a-b7c9-635f7c76c610", b"Twitter Thread Generator", b"Generate engaging Twitter threads on various topics using LangChain.", b"crew", 200000000, 15000000, &mut manager_data.create_agent_events);
    }

    fun create_agent(creator: &signer, id: vector<u8>, name: vector<u8>, description: vector<u8>, agent_type: vector<u8>, price: u64, execution_cost: u64, event_handle: &mut event::EventHandle<CreateAgentEvent>) {
        let id_string = string::utf8(id);
        
        AgentRegistry::create_agent(
            creator,
            id_string,
            string::utf8(name),
            string::utf8(description),
            string::utf8(agent_type),
            price,
            execution_cost
        );

        event::emit_event(event_handle, CreateAgentEvent {
            agent_id: id_string,
        });
    }
}