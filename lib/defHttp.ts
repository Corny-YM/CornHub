import axios from "axios";

const defHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
  headers: {
    Accept: "application/json",
  },
});

defHttp.interceptors.response.use((res) => res.data);

export default defHttp;
