def format_twitter_thread(tweets):
    # Todo: Implement logic to format tweets into a Twitter thread
    return "\n\n".join([f"Tweet {i+1}: {tweet}" for i, tweet in enumerate(tweets)])