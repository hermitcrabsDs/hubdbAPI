const formID = document.getElementById('form_id')
const redirectUrl = document.getElementById('redirect_url');
Notiflix.Loading.init({
    backgroundColor: 'rgba(0,0,0,0.9)',
    svgColor: '#ff5c35', 
    clickToClose: false,
});
async function postRequestForQandA(EndPoint, dataObject){
    const config = new Request(EndPoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObject),
    });
    const response = await fetch(config);
    const responseDataJson = await response.json()
    return responseDataJson;
} 

window.addEventListener('message', async event => {
    if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted' && event.data.id === formID.value) {
        console.log(event.data.data)
        const formData = event.data.data.submissionValues;
        const postRequest = await postRequestForQandA('/_hcms/api/createHudbdRowEndPoint', formData)
        console.log(postRequest)
        const path = postRequest.data.path;
        console.log("execute")
        window.location.replace(`${redirectUrl.value}/${path}`);
    }
})
window.addEventListener('message', async event => {
    if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady' && event.data.id === formID.value) {
        const primaryColor = document.querySelector('.hs-input[name=primary_color]');
        const secondColor = document.querySelector('.hs-input[name=secondary_color]');
        const firstPicker = new jscolor(primaryColor);
        const secondPicker = new jscolor(secondColor);
    }   
})

const fileUploadStoreLogo = async (event) => {
    if (document.querySelector("#stroe_form .hs-input[name=upload_store_logo]").value != '') {
        for (let i = 0; i < document.querySelector(".hs-input[name=upload_store_logo]").files.length; i++) {
            let fileData = document.querySelector(".hs-input[name=upload_store_logo]").files[i];      
            let reader = new FileReader();
            reader.readAsDataURL(fileData)
            reader.onload = async function() {
                const object = { 'imgData': reader.result , 'fileName': fileData.name }
                const postRequest = await postRequestForQandA('/_hcms/api/fileUploadEndPoint', object)
                console.log("Logo ", postRequest.response)
                const imageURL = postRequest.response.url;
                let imagePath = document.querySelector("#stroe_form input[name='image_url']");
                imagePath.value = imageURL;
                imagePath.dispatchEvent(new Event('input', { 'bubbles': true }));
                Notiflix.Loading.remove();
            };
        }
    } 
}


const fileUploadStoreImage = async (event) => {
    if (document.querySelector("#stroe_form .hs-input[name=upload_store_image]").value != '') {
        for (let i = 0; i < document.querySelector(".hs-input[name=upload_store_image]").files.length; i++) {
            let fileData = document.querySelector(".hs-input[name=upload_store_image]").files[i];      
            let reader = new FileReader();
            reader.readAsDataURL(fileData)
            reader.onload = async function() {
                const object = { 'imgData': reader.result , 'fileName': fileData.name }
                const postRequest = await postRequestForQandA('/_hcms/api/fileUploadEndPoint', object)
                console.log("Image ", postRequest.response)
                const imageURL = postRequest.response.url;
                let imagePath = document.querySelector("#stroe_form input[name='store_image_url']");
                imagePath.value = imageURL;
                imagePath.dispatchEvent(new Event('input', { 'bubbles': true }));
                Notiflix.Loading.remove();
            };
        }
    }
}

window.addEventListener("load",async (event) => {
    const  storeLogo = document.querySelector("#stroe_form .hs-input[name=upload_store_logo]");
    const  storeImage = document.querySelector("#stroe_form .hs-input[name=upload_store_image]");
    
    if(storeLogo){
        storeLogo.addEventListener('change', function(eve){
            var ext = storeLogo.value.split('.').pop().toLowerCase();
            if(storeLogo.value != ''){
                if($.inArray(ext, ['gif','png','jpg','jpeg','webp']) == -1) {
                    alert("Not an Image...");
                    storeLogo.value = '';
                } 
                else if (this.files[0].size > 1000000) {
                    alert("Image size greater than 1 Mb");
                    storeLogo.value = '';
                } 
                else {
                    Notiflix.Loading.hourglass('Image uploading...');
                    if(eve.target.files[0]){
                        img = new Image();
                        img.src = window.URL.createObjectURL( eve.target.files[0] )
                        img.onload = async function() {
                            let upd = await fileUploadStoreLogo(storeLogo)
                            }
                    }
                }
            }

        })
    }
    
    if(storeImage){
        storeImage.addEventListener('change', function(eve){
            var ext = storeImage.value.split('.').pop().toLowerCase();
            if(storeImage.value != ''){
                if($.inArray(ext, ['gif','png','jpg','jpeg','webp']) == -1) {
                    alert("Not an Image...");
                    storeLogo.value = '';
                } 
                else if (this.files[0].size > 1000000) {
                    alert("Image size greater than 1 Mb");
                    storeImage.value = '';
                } 
                else {
                    Notiflix.Loading.hourglass('Image uploading...');
                    if(eve.target.files[0]){
                        img = new Image();
                        img.src = window.URL.createObjectURL( eve.target.files[0] )
                        img.onload = async function() {
                            let upd = await fileUploadStoreImage(storeImage)
                            }
                    }
                }
            }

        })
    }
})
