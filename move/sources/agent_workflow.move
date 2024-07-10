module agent_space::agent_workflow {
    use std::string::{String, utf8};
    use std::signer;
    use aptos_framework::object::{Self, Object};
    use aptos_token::token::{Self, TokenDataId};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct AgentWorkflow has key {
        token_data_id: TokenDataId,
        creator: address,
        description: String,
        license_price: u64,
    }

    struct License has key {
        workflow: Object<AgentWorkflow>,
        owner: address,
        expiration: u64,
    }

    const E_NOT_CREATOR: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_LICENSE_EXPIRED: u64 = 3;

    public fun create_workflow(
        creator: &signer,
        description: String,
        license_price: u64,
    ) {
        let creator_address = signer::address_of(creator);
        let constructor_ref = object::create_named_object(creator, b"AgentWorkflow");
        let token_data_id = token::create_tokendata(
            creator,
            utf8(b"AgentSpace"),
            utf8(b"AI Workflow"),
            description,
            0, // max supply
            utf8(b"https://example.com/metadata"),
            creator_address,
            0, // royalty numerator
            10, // royalty denominator
            token::create_token_mutability_config(
                &vector<bool>[false, false, false, false, true]
            ),
            vector::empty<String>(),
            vector::empty<vector<u8>>(),
            vector::empty<String>(),
        );

        let workflow = AgentWorkflow {
            token_data_id,
            creator: creator_address,
            description,
            license_price,
        };
        move_to(&object::generate_signer(&constructor_ref), workflow);
    }

    public fun buy_license(
        buyer: &signer,
        workflow: Object<AgentWorkflow>,
        duration: u64,
    ) acquires AgentWorkflow {
        let workflow_data = borrow_global<AgentWorkflow>(object::object_address(&workflow));
        let price = workflow_data.license_price * duration;

        assert!(
            coin::balance<AptosCoin>(signer::address_of(buyer)) >= price,
            E_INSUFFICIENT_BALANCE
        );

        coin::transfer<AptosCoin>(buyer, workflow_data.creator, price);

        let license = License {
            workflow,
            owner: signer::address_of(buyer),
            expiration: aptos_framework::timestamp::now_seconds() + duration,
        };
        move_to(buyer, license);
    }

    public fun execute_workflow(
        executor: &signer,
        workflow: Object<AgentWorkflow>,
    ) acquires License {
        let executor_address = signer::address_of(executor);
        let license = borrow_global<License>(executor_address);

        assert!(license.workflow == workflow, E_NOT_CREATOR);
        assert!(
            license.expiration > aptos_framework::timestamp::now_seconds(),
            E_LICENSE_EXPIRED
        );

        // Execute workflow logic here
        // This is where you'd implement the off-chain call to run the AI workflow
    }

    public fun update_license_price(
        creator: &signer,
        workflow: Object<AgentWorkflow>,
        new_price: u64,
    ) acquires AgentWorkflow {
        let workflow_data = borrow_global_mut<AgentWorkflow>(object::object_address(&workflow));
        assert!(signer::address_of(creator) == workflow_data.creator, E_NOT_CREATOR);
        workflow_data.license_price = new_price;
    }
}