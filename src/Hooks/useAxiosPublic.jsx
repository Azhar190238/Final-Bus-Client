import axios from "axios";

const axiosSecurePublic = axios.create({
    baseURL: 'https://api.koyrabrtc.com/'
})
const useAxiosPublic = () => {
    return axiosSecurePublic
};

export default useAxiosPublic;