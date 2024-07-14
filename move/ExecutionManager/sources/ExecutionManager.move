module AgentSpace::ExecutionManager {
    use AgentSpace::AgentRegistry::{Self, Agent};
    use AgentSpace::AgentCoin;
    use aptos_framework::object::Object;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::signer;
    use std::string::String;

    struct Execution has drop, store {
        agent_id: String,
        user: address,
        start_time: u64,
        duration: u64,
        cost: u64,
    }

    struct ExecutionData has key {
        execution_events: event::EventHandle<Execution>,
    }

    public entry fun initialize(account: &signer) {
        let execution_data = ExecutionData {
            execution_events: account::new_event_handle<Execution>(account),
        };
        move_to(account, execution_data);
    }

    public entry fun execute_agent(user: &signer, agent: Object<Agent>, duration: u64) acquires ExecutionData {
        let (id, _, _, _, creator, _, execution_cost) = AgentRegistry::get_agent_details(agent);
        let user_addr = signer::address_of(user);
        let total_cost = execution_cost * duration;

        // Transfer AgentCoins from user to creator
        AgentCoin::transfer(user, creator, total_cost);

        // Emit execution event
        let execution_data = borrow_global_mut<ExecutionData>(creator);
        event::emit_event(
            &mut execution_data.execution_events,
            Execution {
                agent_id: id,
                user: user_addr,
                start_time: timestamp::now_seconds(),
                duration,
                cost: total_cost,
            },
        );
    }
}