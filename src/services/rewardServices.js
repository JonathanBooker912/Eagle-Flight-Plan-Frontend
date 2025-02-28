import apiClient from "./services.js";
import axios from "axios";
import Utils from "../config/utils.js";
export default {
    getAllRewards(page, pageSize, searchQuery) {
        return apiClient.get("/reward", {
            params: {
                page: page,
                pageSize: pageSize,
                searchQuery: searchQuery
            }
        });
    },
    deleteReward(rewardId) {
        return apiClient.delete(`/reward/${rewardId}`);
    },
    getReward(rewardId) {
        return apiClient.get(`/reward/${rewardId}`);
    },
    createReward(rewardData) {
        let baseurl = getBaseURL();
        let formData = jsonToFormData(rewardData);
        return axios.post(baseurl + `/reward`, formData, {
            headers: { Authorization: getAuthHeader() }
        });
    },
    updateReward(rewardId, rewardData) {
        return apiClient.put(`/reward/${rewardId}`, rewardData);
    }
};

function jsonToFormData(json) {
    const formData = new FormData();
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            formData.append(key, json[key]);
        }
    }
    return formData;
}

function getAuthHeader() {
    let user = Utils.getStore("user");
    if (user != null) {
        let token = user.token;
        let authHeader = "";
        if (token != null && token != "") authHeader = "Bearer " + token;
        return authHeader;
    }
    return "";
}

function getBaseURL() {
    if (import.meta.env.DEV) {
        return "http://localhost:3031/flight-plan-t1";
    } else {
        return "/flight-plan-t1";
    }
}
