// import axios from 'axios';
// import { configuration as config } from '../config.js';
// import fs from 'fs';

async function getInsights(id) {
    return {
        insights: 'ok'
    }
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

// export function getUserData() {
//     const lastUpdatedTimestamp = getLastUpdatedTimestamp('insights')
//     getInsights(lastUpdatedTimestamp);
//     writeInsightTimestamp();
//     const businessUpdatedTimestamp = getLastUpdatedTimestamp('business');
//     getBusinessDiscovery(businessUpdatedTimestamp);
//     writeBusinessDiscoveryTimestamp();
//     //const mediaUpdatedTimestamp = getLastUpdatedTimestamp('media');
//     //await getUserMedia(mediaUpdatedTimestamp);

// }

// function writeInsightTimestamp() {
//     const updateDateStream = fs.createWriteStream('update-insights.txt', {flags: 'w'});
//     const TIMESTAMP_DAY = 86400;
//     const currentTime = parseInt((Date.now() / 1000).toFixed(0))
//     const timeStamp = currentTime - TIMESTAMP_DAY
//     updateDateStream.write(timeStamp.toString());
//     updateDateStream.end();
// }

// function writeBusinessDiscoveryTimestamp() {
//     const updateDateStream = fs.createWriteStream('update-business.txt', {flags: 'w'});
//     const currentTime = parseInt((Date.now() / 1000).toFixed(0))

//     updateDateStream.write(currentTime.toString());
//     updateDateStream.end();
// }

// export async function getInsights(lastUpdatedTimestamp) {
//     const insights = config.instagramConfiguration.insights;
//     try {
//         Object.entries(insights).forEach(async ([metric, period]) => {
//             try {
//                 const instagramId = config.instagramConfiguration.client.instagramId;
                
//                 if(metric == 'audience_city' || metric == 'audience_country' || metric == 'audience_gender_age' || metric == 'audience_locale') {
//                     return getAperiodicInsight(instagramId, metric, period);       
//                 }
//                 getPeriodicInsight(lastUpdatedTimestamp, instagramId, metric, period);
                
//             } catch(err) { 
//                 console.log("Error")
//                 if(!err.response)
//                     console.log(err)
//                 else
//                     console.error(err.response)
//             } 
//         });
//     } catch(err) {
//         console.error(err);
//         console.log("Ocurrio un error en getInsights");
//     }   
// }

// async function getAperiodicInsight(instagramId, metric, period) {
//     const stream = fs.createWriteStream('data/' + metric + ".csv", {flags: 'w'});
//     try {
//         let response = await axios.get(config.FACEBOOK_GRAPH_API + instagramId + 
//             '/insights?metric='+metric+'&period='+period+'&access_token=' + config.instagramConfiguration.app.longLivedToken);
    
//         let values = response.data.data[0].values[0].value
//         Object.entries(values).forEach(([key, val]) => {
//             stream.write(key + ',' + val + '\n');
//         });
//     } catch(err) {
//         throw(err)
//     } finally {
//         stream.end();
//     }

// }

// async function getPeriodicInsight(lastUpdatedTimestamp, instagramId, metric, period) {
//     // Update from lastUpdatedTimestamp to currentDay - 1.
//     // This way you avoid daily "half-updates".
//     // 23/07/2020 -> 
//     const TIMESTAMP_DAY = 86400;
//     const rangeLimit = 2592000;

//     // Calculate current date and set update limit until today (yesterday's end) at 00:00:00
//     const currentTime = parseInt((Date.now() / 1000).toFixed(0))
//     const currentDay = new Date(currentTime * 1000);
//     currentDay.setHours(0); currentDay.setMinutes(0); currentDay.setSeconds(0);
//     const timeLimit = (currentDay.getTime() / 1000).toFixed(0);
//     //

//     const stream = fs.createWriteStream('data/' + metric + ".csv", {flags: 'a'});
//     try {
//         let timestampRanges = []
//         let from = parseInt(lastUpdatedTimestamp)
//         let to = null
//         while(from < timeLimit) {
//             to = from + rangeLimit-1; 
//             timestampRanges.push({from: from, to: to});
//             from = to + 1;
//         }
        
//         console.log(metric);
//         console.log(timestampRanges);
//         for(let timestampRange of timestampRanges) {
//             if(timestampRange.to > (timeLimit)) {
//                 timestampRange.to = timeLimit;
//             }
            
//             let response = await axios.get(config.FACEBOOK_GRAPH_API + instagramId + 
//                 '/insights?metric='+metric+'&period='+period+'&since='+timestampRange.from+'&until='+timestampRange.to+'&access_token=' + config.instagramConfiguration.app.longLivedToken);
            
//             let historicValues = []
//             if(response.data.data[0])
//                 historicValues = response.data.data[0].values;
            
//             if(metric == 'online_followers') {
//                 writeOnlineFollowers(stream, historicValues);
//             } else {
//                 historicValues.forEach(historicValue => {
//                     console.log("Metric: " + metric);
//                     console.log("Writing to file: " + historicValue.end_time.slice(0, 10) + "," + historicValue.value);
//                     stream.write(historicValue.end_time.slice(0, 10) + ',' + historicValue.value + '\n');
//                 })
//             }
//         }
//     } catch(err) {
//         throw(err)
//     } finally {
//         stream.end();
//     }
   
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

// function getLastUpdatedTimestamp(type) {
//     if(type == 'insights') {
//         return fs.readFileSync('update-insights.txt', "utf-8")
//     } else if (type == 'business') {
//         return fs.readFileSync('update-business.txt', "utf-8")
//     } else if (type == 'media') {
//         return fs.readFileSync('update-media.txt', "utf-8")
//     }
// }

module.exports = {
    getInsights: getInsights
};