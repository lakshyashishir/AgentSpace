module agent_space::marketplace {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::object::{Self, Object};
    use agent_space::agent_workflow::{Self, AgentWorkflow};

    struct Listing has key {
        workflow: Object<AgentWorkflow>,
        price: u64,
    }

    const E_NOT_OWNER: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;

    public fun list_workflow(
        owner: &signer,
        workflow: Object<AgentWorkflow>,
        price: u64
    ) {
        let listing = Listing {
            workflow,
            price,
        };
        move_to(owner, listing);
    }

    public fun buy_workflow(
        buyer: &signer,
        owner: address,
    ) acquires Listing {
        let listing = move_from<Listing>(owner);
        let buyer_address = signer::address_of(buyer);

        assert!(
            coin::balance<AptosCoin>(buyer_address) >= listing.price,
            E_INSUFFICIENT_BALANCE
        );

        coin::transfer<AptosCoin>(buyer, owner, listing.price);
        object::transfer(owner, listing.workflow, buyer_address);
    }

    public fun cancel_listing(
        owner: &signer,
    ) acquires Listing {
        let owner_address = signer::address_of(owner);
        let Listing { workflow: _, price: _ } = move_from<Listing>(owner_address);
    }
}