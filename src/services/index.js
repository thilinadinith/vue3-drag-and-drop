const getDataUrl = document.querySelector("#get-data-url").value;
const postDataUrl = document.querySelector("#post-data-url").value;

const api = {

    root: import.meta.env.VITE_BASE_URL,
    getData: getDataUrl,
    postData: postDataUrl,

}

export default api