import axios from "axios";
const all = (payload) => {
    return new Promise((resolve, reject) => {
        axios.get(`/users.json?offset=${payload.offset}&limit=${payload.limit}`).then((response) => {
            // we need to return something similar to what a server would return
            let allUsers = response.data;
            const total = allUsers.length;
            const currentUsers = allUsers.splice((payload.offset), payload.limit);
            // console.log(currentUsers)
            let usersMeta = {
                data: currentUsers,
                total
            };
            setTimeout(() => {
                resolve(usersMeta)
            }, 500);
        }).catch((error) => {
            // in our case will never fail
            reject(error)
        });
    })
}

export default {
    all
}
