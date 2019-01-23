import axios from "axios";
const all = (payload) => {
    return new Promise((resolve, reject) => {
        axios.get(`/users.json?page=${payload.page}&per_page=${payload.per_page}`).then((response) => {
            // we need to return something similar to what a server would return
            let allUsers = response.data;

            const currentUsers = allUsers.splice((payload.page - 1) * payload.per_page, payload.per_page);

            let usersMeta = {
                data: currentUsers,
                total: allUsers.length
            }

            resolve(usersMeta)
        }).catch((error) => {
            // in our case will never fail
            reject(error)
        });
    })
}

export default {
    all
}
