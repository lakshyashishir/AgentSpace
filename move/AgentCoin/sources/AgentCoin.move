module AgentSpace::AgentCoin {
    use std::option;
    use std::string;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata};
    use aptos_framework::object;
    use aptos_framework::primary_fungible_store;

    struct AgentCoin has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef,
        burn_ref: BurnRef,
    }

    const SYMBOL: vector<u8> = b"AGCN";

    public entry fun initialize(account: &signer) {
        let constructor_ref = object::create_named_object(account, SYMBOL);
        
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            &constructor_ref,
            option::none(),
            string::utf8(b"AgentCoin"),
            string::utf8(SYMBOL),
            6, // decimals
            string::utf8(b"https://agent-space.vercel.app/agentcoin.png"), // icon
            string::utf8(b"https://agent-space.vercel.app/"), // project
        );

        let mint_ref = fungible_asset::generate_mint_ref(&constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(&constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(&constructor_ref);

        let agent_coin = AgentCoin {
            mint_ref,
            transfer_ref,
            burn_ref,
        };

        let signer = object::generate_signer(&constructor_ref);
        move_to(&signer, agent_coin);
    }

    public entry fun mint(_admin: &signer, to: address, amount: u64) acquires AgentCoin {
        let metadata_object = object::address_to_object<Metadata>(object::create_object_address(&@AgentSpace, SYMBOL));
        let agent_coin = borrow_global<AgentCoin>(object::object_address(&metadata_object));
        let coins = fungible_asset::mint(&agent_coin.mint_ref, amount);
        primary_fungible_store::deposit(to, coins);
    }

    public entry fun transfer(from: &signer, to: address, amount: u64) {
        let metadata_object = object::address_to_object<Metadata>(object::create_object_address(&@AgentSpace, SYMBOL));
        primary_fungible_store::transfer(from, metadata_object, to, amount);
    }

    #[view]
    public fun balance(owner: address): u64 {
        let metadata_object = object::address_to_object<Metadata>(object::create_object_address(&@AgentSpace, SYMBOL));
        primary_fungible_store::balance(owner, metadata_object)
    }
}