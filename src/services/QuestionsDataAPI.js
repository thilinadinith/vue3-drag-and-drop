import axios from 'axios'
import api from '.'

export default {
    getData(payload, cb, errorCb) {
        let url = api.root + api.getData

        axios
            .get(url)
            .then(function(res) {
                cb(res)
            })
            .catch(function(res) {
                errorCb(res)
            })
    },



    postData(payload, cb, errorCb) {
        // let query = ''

        let url = api.root + api.postData

        axios
            .post(url, payload)
            .then(function(res) {
                // console.log(res.data)
                cb(res)
            })
            .catch(function(res) {
                errorCb(res)
            })
    }
}