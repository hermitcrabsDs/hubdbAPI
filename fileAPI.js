const axios = require('axios');
const ENROLLMENT_ACCESS_TOKEN = process.env.MS_FILE_ACCESS_TOKEN;
const FormData = require('form-data');
const crypto = require('crypto');
const URL = `https://api.hubapi.com/files/v3/files`;

exports.main = async (context, sendResponse) => {
    let urlForImage = context.body.imgData;
    let userName = context.body.user_name;
    let file_Name =  context.body.fileName
    let folderId = "180564201747"; //Folder name is Upload Via Form

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${ENROLLMENT_ACCESS_TOKEN}`,
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
        }
    };

    const form = new FormData();
    const fileB64Arr = urlForImage;
    let b64String = fileB64Arr[1];
    let splitResult = fileB64Arr.split(",")[1]
    let buffer = Buffer.from(splitResult, 'base64');

    const file_options = {
        access: 'PUBLIC_INDEXABLE',
        overwrite: true,
        duplicateValidationStrategy: 'NONE',
        duplicateValidationScope: 'EXACT_FOLDER'
    };
    let uploadHeaders = form.getHeaders();
    config.headers = {...config.headers, ...uploadHeaders};
    form.append('file', buffer, file_Name);
    form.append('fileName', `${file_Name}`);
    form.append('options', JSON.stringify(file_options));
    form.append('folderId', '180564201747');



    try {
        let response = await axios.post(URL, form, config);
        const imageData = response.data;
        const imageUrl = imageData.url;

        sendResponse({ body: { response: response.data, message: "certificat create successfully" ,b64String: b64String , buffer: buffer, urlForImage: urlForImage , fileB64Arr: fileB64Arr, splitResult: splitResult }, statusCode: 200 });

    }catch(error){
        sendResponse({ body: { message: error.message }, statusCode: 500 });
    }

};
