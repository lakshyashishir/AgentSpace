module AgentSpace::Marketplace {
    use AgentSpace::AgentRegistry::{Self, Agent};
    use AgentSpace::AgentCoin;
    use aptos_framework::object::Object;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::signer;
    use std::string::String;

    struct AgentPurchase has drop, store {
        buyer: address,
        agent_id: String,
    }

    struct MarketplaceData has key {
        purchase_events: event::EventHandle<AgentPurchase>,
    }

    public entry fun initialize(account: &signer) {
        let marketplace_data = MarketplaceData {
            purchase_events: account::new_event_handle<AgentPurchase>(account),
        };
        move_to(account, marketplace_data);
    }

    public entry fun buy_agent(buyer: &signer, agent: Object<Agent>) acquires MarketplaceData {
        let (id, _, _, _, creator, price, _) = AgentRegistry::get_agent_details(agent);
        let buyer_addr = signer::address_of(buyer);

        // Transfer AgentCoins from buyer to creator
        AgentCoin::transfer(buyer, creator, price);

        // Emit purchase event
        let marketplace_data = borrow_global_mut<MarketplaceData>(creator);
        event::emit_event(
            &mut marketplace_data.purchase_events,
            AgentPurchase {
                buyer: buyer_addr,
                agent_id: id,
            },
        );
    }
}