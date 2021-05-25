require('dotenv').config('./env')

const configuration = {
    FACEBOOK_GRAPH_API: "https://graph.facebook.com/v7.0",
    serverConfiguration: {

    },
    instagramConfiguration: {
        app: {
            id: process.env.APP_ID,
            secret: process.env.APP_SECRET,
            longLivedToken: process.env.LONG_LIVED_TOKEN
        },
        client: {
            facebookId: process.env.CLIENT_FACEBOOK_ID,
            instagramId: process.env.CLIENT_INSTAGRAM_ID
        },
        insights: {
            audience_city: 'lifetime', 
            audience_country: 'lifetime',
            audience_gender_age: 'lifetime',
            audience_locale: 'lifetime',
            email_contacts: 'day',
            follower_count: 'day',
            get_directions_clicks: 'day',
            impressions: 'day', //['day', 'week', 'days_28'],
            online_followers: 'lifetime',
            phone_call_clicks: 'day',
            profile_views: 'day',
            reach: 'day', //['day', 'week', 'days_28'],
            text_message_clicks: 'day',
            website_clicks: 'day'
        }
    }
}

module.exports = {
    config: configuration
}