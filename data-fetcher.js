import axios from 'axios';
import { configuration as config } from './config.js';
import fs from 'fs';

export function getData() {
    const lastUpdatedTimestamp =  getLastUpdatedTimestamp('insights')
    getInsights(lastUpdatedTimestamp);
}

/*
    Insights table:
        audience_city, lifetime 
        audience_country, ifetime
        audience_gender_age, lifetime
        audience_locale, lifetime
        email_contacts, day
        follower_count, day
        get_directions_clicks, day
        impressions, {day, week, days_28}
        online_followers, lifetime
        phone_call_clicks, day
        profile_views, day
        reach, {day, week, days_28}
        text_message_clicks, day
        website_clicks, day
*/

//TODO: Hacer que automaticamente haga todos los insights!
async function getInsights(lastUpdatedTimestamp) {
    const metric = 'follower_count'
    const period = 'day'
    const stream = fs.createWriteStream('data/' + metric + ".csv", {flags: 'a'});
    const instagramId = config.instagramConfiguration.client.instagramId;
    const rangeLimit = 2592000;
    const updateDateStream = fs.createWriteStream('update-insights.txt', {flags: 'w'});

    try {
        if(metric == 'audience_city' || metric == 'audience_country' || metric == 'audience_gender_age' || metric == 'audience_locale') {
            let response = await axios.get(config.FACEBOOK_GRAPH_API + instagramId + 
                '/insights?metric='+metric+'&period='+period+'&access_token=' + config.instagramConfiguration.app.longLivedToken);

            let values = response.data.data[0].values[0].value
            Object.entries(values).forEach(([key, val]) => {
                stream.write(key + ',' + val + '\n');
              });

            console.log(values)
            return values
        }
        // timestampRanges is an array of objects {from: 'timestamp', to: 'timestamp'}
        let timestampRanges = []
        const currentTime = parseInt((Date.now() / 1000).toFixed(0))
        let from = lastUpdatedTimestamp
        let to = null
        while(from < currentTime) {
            to = from + rangeLimit-1; 
            timestampRanges.push({from: from, to: to});
            from = to + 1;
        }

        for(let timestampRange of timestampRanges) {

            if(timestampRange.to > currentTime) {
                timestampRange.to = currentTime;
            }

            let response = await axios.get(config.FACEBOOK_GRAPH_API + instagramId + 
                '/insights?metric='+metric+'&period='+period+'&since='+timestampRange.from+'&until='+timestampRange.to+'&access_token=' + config.instagramConfiguration.app.longLivedToken);
            
            let historicValues = response.data.data[0].values;
            
            if(metric == 'online_followers') {
                historicValues.forEach(historicValue => {
                    const hourValues = [];
                    for(let i = 0; i < 24; i++) {
                        hourValues.push(historicValue.value[i.toString()])
                    }
                    const hourValuesCsv = hourValues.join(", ")
                    stream.write(historicValue.end_time + ',' + hourValuesCsv + '\n');
                })
            } else {
                historicValues.forEach(historicValue => {
                    stream.write(historicValue.end_time + ',' + historicValue.value + '\n');
                })
            }
        }
    } catch(err) { 
        console.log("Error")
        if(!err.response)
            console.log(err)
        else
            console.error(err.response)
    } finally {
        updateDateStream.write((Date.now() / 1000).toFixed(0));
        stream.end();
    }
}

function getLastUpdatedTimestamp(type) {
    if(type == 'insights') {
        return fs.readFileSync('update-insights.txt', "utf-8")
    }
}