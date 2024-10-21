const axios = require('axios');
const MARKETPOS_HUBDB_ACCESS_TOKEN = process.env.MS_HUBDB_ACCESS_TOKEN;

exports.main = async (context, sendResponse) => {
    const data = context.body
    const path = data.store_name.toLowerCase().replace(/[^a-z]/g, "-");
    let x = Math.floor((Math.random() * 10000) + 1);
   

    const body = {
        "path":  `${data.store_name}-${x}`,
        "values": {
            "first_name": data.firstname,
            "last_name": data.lastname,
            "email": data.email,
            "phone_number": data.phone,
            "store_name": data.store_name,
            "store_logo": {
                "url": data.image_url,
                "type": "image"
            },
            "store_image": {
                "url": data.store_image_url,
                "type": "image"
            },
            "store_url" : data.website,
            "store_address" : data.address,
            "primary_color" : data.primary_color,
            "secondary_color": data.secondary_color
        },
        "name": data.store_name
    }
    
    console.log("context",  body)

    let createConfig = {
        method: 'POST',
        url: `https://api.hubapi.com/cms/v3/hubdb/tables/30107421/rows`,
        headers: {
            'Authorization': `Bearer ${MARKETPOS_HUBDB_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: body
    };
    try {
        const response = await axios(createConfig)
        const associationConfig = {
            method: 'POST',
            url: `https://api.hubapi.com/cms/v3/hubdb/tables/30107421/draft/publish`,
            headers: {
                'Authorization': `Bearer ${MARKETPOS_HUBDB_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        try{
            const associationResponse = await axios(associationConfig) 
            sendResponse({ body: { data: response.data, message: "Created and associated successfully" } }); 
        } catch(error){
            sendResponse({ body: { associationerror : error, message: error.message } }); 
        }
    }catch(error){
        sendResponse({ body: { mainerror : error, message: error.message } }); 
    }
}
