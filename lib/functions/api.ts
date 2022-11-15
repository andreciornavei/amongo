import axios from "axios";
export const api = axios.create({
  baseURL: "https://realm.mongodb.com/api/admin/v3.0",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  validateStatus: function (status) {
    return status < 300;
  },
});
