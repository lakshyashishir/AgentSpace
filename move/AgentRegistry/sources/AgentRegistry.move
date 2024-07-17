module AgentSpace::AgentRegistry {
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::signer;

    struct Agent has key, store {
        id: String,
        name: String,
        description: String,
        agent_type: String,
        creator: address,
        price: u64,
        execution_cost: u64,
    }

    struct AgentCreatedEvent has drop, store {
        agent_id: String,
        creator: address,
    }

    struct AgentStore has key {
        agents: vector<Object<Agent>>,
        create_agent_events: event::EventHandle<AgentCreatedEvent>,
    }

    const E_ALREADY_INITIALIZED: u64 = 1;

    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<AgentStore>(account_addr), E_ALREADY_INITIALIZED);
        let agent_store = AgentStore {
            agents: vector::empty(),
            create_agent_events: account::new_event_handle<AgentCreatedEvent>(account),
        };
        move_to(account, agent_store);
    }

    public fun is_initialized(account: address): bool {
        exists<AgentStore>(account)
    }

    public entry fun create_agent(
    creator: &signer,
    id: String,
    name: String,
    description: String,
    agent_type: String,
    price: u64,
    execution_cost: u64
) acquires AgentStore {
    let creator_address = signer::address_of(creator);
    let agent = Agent {
        id,
        name,
        description,
        agent_type,
        creator: creator_address,
        price,
        execution_cost,
    };

    let constructor_ref = object::create_named_object(creator, *string::bytes(&id));
    let agent_obj = object::object_from_constructor_ref<Agent>(&constructor_ref);
    let signer = object::generate_signer(&constructor_ref);
    move_to(&signer, agent);

    if (!exists<AgentStore>(creator_address)) {
        move_to(creator, AgentStore {
            agents: vector::empty(),
            create_agent_events: account::new_event_handle<AgentCreatedEvent>(creator),
        });
    };

    let agent_store = borrow_global_mut<AgentStore>(creator_address);
    vector::push_back(&mut agent_store.agents, agent_obj);

    event::emit_event(
        &mut agent_store.create_agent_events,
        AgentCreatedEvent {
            agent_id: id,
            creator: creator_address,
        },
    );
}

    #[view]
    public fun get_all_agents(): vector<Object<Agent>> acquires AgentStore {
        let agents = vector::empty();
        if (exists<AgentStore>(@AgentSpace)) {
            let store = borrow_global<AgentStore>(@AgentSpace);
            agents = store.agents;
        };
        agents
    }

    #[view]
    public fun get_agent_details(agent: Object<Agent>): (String, String, String, String, address, u64, u64) acquires Agent {
        let agent_address = object::object_address(&agent);
        let agent_data = borrow_global<Agent>(agent_address);
        (
            agent_data.id,
            agent_data.name,
            agent_data.description,
            agent_data.agent_type,
            agent_data.creator,
            agent_data.price,
            agent_data.execution_cost
        )
    }
}