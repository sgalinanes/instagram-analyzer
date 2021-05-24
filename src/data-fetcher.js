// import { configuration as config } from '../config.js';
const fs = require('fs');
const axios  = require('axios');
const { config } = require('../config');  
const INSIGHTS_NAME = 'insights';
const BUSINESS_NAME = 'business';
const MEDIA_NAME = 'media';

function isAperiodic(metric) {
    const aperiodicInsights = ['audience_city', 'audience_country', 'audience_gender_age', 'audience_locale']

    if (aperiodicInsights.includes(metric))
        return true 

    return false 
}

async function getInsights(id) {
    // const instagramId = config.instagramConfiguration.client.instagramId;
    const instagramId = id;
    const lastUpdatedTimestamp = getLastUpdatedTimestamp(INSIGHTS_NAME);
    const insightOptions = config.instagramConfiguration.insights;

    const insights = await Promise.all(Object.entries(insightOptions).map(async ([metric, period]) => {
        try {
            if (isAperiodic(metric)) {
                const values = await getAperiodicInsight(instagramId, metric, period)
                return {
                    type: 'aperiodic',
                    metric: metric,
                    values: values
                }
            } else {
                const values = await getPeriodicInsight(lastUpdatedTimestamp, instagramId, metric, period);
                return {
                    type: 'periodic',
                    metric: metric,
                    values: values
                }
            }
        } catch(err) { 
            console.error("An error ocurred")
            if(!err.response)
                console.error(err)
            else
                console.error(err.response)
        } 
    }));

    updateTimestamp()
    return insights
}

async function getAperiodicInsight(instagramId, metric, period) {
    //const stream = fs.createWriteStream('data/' + metric + ".csv", {flags: 'w'});
    const url = `${config.FACEBOOK_GRAPH_API}/${instagramId}/insights?metric=${metric}&period=${period}&access_token=${config.instagramConfiguration.app.longLivedToken}`
    const response = await axios.get(url)

    const values = response?.data?.data[0]?.values[0]?.value
    if (!values) {
        const err = "An error occurred while getting the aperiodic insights"
        throw err
    }

    return values
    // Object.entries(values).forEach(([key, val]) => {
    //     stream.write(key + ',' + val + '\n');
    // });
}

async function getPeriodicInsight(lastUpdatedTimestamp, instagramId, metric, period) {
    // Update from lastUpdatedTimestamp to currentDay - 1.
    // This way you avoid daily "half-updates".
    const TIMESTAMP_DAY = 86400; // 1 day
    const rangeLimit = TIMESTAMP_DAY * 30; // 1 month  

    // Calculate current date and set update limit until today (yesterday's end) at 00:00:00
    const currentTime = parseInt((Date.now() / 1000).toFixed(0))
    const currentDay = new Date(currentTime * 1000);
    currentDay.setHours(0); currentDay.setMinutes(0); currentDay.setSeconds(0);
    const timeLimit = (currentDay.getTime() / 1000).toFixed(0);

    //const stream = fs.createWriteStream('data/' + metric + ".csv", {flags: 'a'});
    const timestampRanges = []
    let from = parseInt(lastUpdatedTimestamp)
    let to = null
    while(from < timeLimit) {
        to = from + rangeLimit-1; 
        timestampRanges.push({from: from, to: to});
        from = to + 1;
    }
    
    console.log(metric);
    console.log(timestampRanges);
    const historicValuesArray = []
    for(let timestampRange of timestampRanges) {
        if(timestampRange.to > (timeLimit)) {
            timestampRange.to = timeLimit;
        }

        const url = `${config.FACEBOOK_GRAPH_API}/${instagramId}/insights?metric=${metric}&period=${period}&since=${timestampRange.from}&until=${timestampRange.to}&access_token=${config.instagramConfiguration.app.longLivedToken}`
        const response = await axios.get(url)

        let historicValues = []
        if(response.data.data[0])
            historicValues = response.data.data[0].values;
        
        historicValuesArray.push(historicValues)
        // if(metric == 'online_followers') {
        //     writeOnlineFollowers(stream, historicValues);
        // } else {
        //     historicValues.forEach(historicValue => {
        //         console.log("Metric: " + metric);
        //         console.log("Writing to file: " + historicValue.end_time.slice(0, 10) + "," + historicValue.value);
        //         stream.write(historicValue.end_time.slice(0, 10) + ',' + historicValue.value + '\n');
        //     })
        // }
    }

    return historicValuesArray
    // } finally {
    //     stream.end();
    // }
}

function getLastUpdatedTimestamp(type) {
    switch(type) {
        case INSIGHTS_NAME:
            return fs.readFileSync('update-insights.txt', 'utf-8');

        case BUSINESS_NAME:
            return fs.readFileSync('update-business.txt', 'utf-8');

        case MEDIA_NAME:
            return fs.readFileSync('update-media.txt', 'utf-8');

        default:
            // TODO: Fail somehow
            break;
    }
}

function updateTimestamp() {
    const updateDateStream = fs.createWriteStream('update-insights.txt', {flags: 'w'});
    const TIMESTAMP_DAY = 86400;
    const currentTime = parseInt((Date.now() / 1000).toFixed(0))
    const timeStamp = currentTime - TIMESTAMP_DAY
    updateDateStream.write(timeStamp.toString());
    updateDateStream.end();
}

// function timeConverter(UNIX_timestamp){
//     var a = new Date(UNIX_timestamp * 1000);
//     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//     var year = a.getFullYear();
//     var month = months[a.getMonth()];
//     var date = a.getDate();
//     var hour = a.getHours();
//     var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
//     var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
//     var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
//     return time;
// }

// function writeBusinessDiscoveryTimestamp() {
//     const updateDateStream = fs.createWriteStream('update-business.txt', {flags: 'w'});
//     const currentTime = parseInt((Date.now() / 1000).toFixed(0))

//     updateDateStream.write(currentTime.toString());
//     updateDateStream.end();
// }


// async function getBusinessDiscovery(lastUpdatedTimestamp) {
//     const TIMESTAMP_DAY = 86400;
//     // Calculate current date and set update limit until today (yesterday's end) at 00:00:00
//     const lastDay = new Date(lastUpdatedTimestamp * 1000);
//     lastDay.setHours(0); lastDay.setMinutes(0); lastDay.setSeconds(0);
//     const timeLimit = parseInt((lastDay.getTime() / 1000).toFixed(0)) + TIMESTAMP_DAY;
//     const currentTime = parseInt((Date.now() / 1000).toFixed(0))

//     if(currentTime < timeLimit) {
//         console.log("Already updated today");
//         return;
//     }

//     const instagramId = config.instagramConfiguration.client.instagramId;
//     const stream = fs.createWriteStream('data/total_follower_count.csv', {flags: 'a'});
//     try {
//         let response = await axios.get(config.FACEBOOK_GRAPH_API + instagramId + 
//             '?fields=business_discovery.username(by.beyond){followers_count}&access_token=' + config.instagramConfiguration.app.longLivedToken);
        
//         let follower_count = response.data.business_discovery.followers_count;
//         let follower_count_time = Date.now();
//         stream.write(timeConverter(parseInt(follower_count_time.toString().slice(0, 10))) + ',' + follower_count + '\n');
//     } catch(err) {
//         console.error(err);
//     }
// }

// function writeOnlineFollowers(stream, historicValues) {
//     historicValues.forEach(historicValue => {
//         const hourValues = [];
//         for(let i = 0; i < 24; i++) {
//             hourValues.push(historicValue.value[i.toString()])
//         }
//         const hourValuesCsv = hourValues.join(", ")
//         stream.write(historicValue.end_time.slice(0, 10) + ',' + hourValuesCsv + '\n');
//     })
// }

module.exports = {
    getInsights: getInsights
};
