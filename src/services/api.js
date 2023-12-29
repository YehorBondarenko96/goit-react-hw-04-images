import axios from "axios";

export const fetchForSearch = async (dataForSearch, page) => {
    const messyResult = await axios.get(`https://pixabay.com/api/?q=${dataForSearch}&page=${page}&key=40289268-709deefe1360f0520e7e421a0&image_type=photo&orientation=horizontal&per_page=12`);
    return messyResult.data.hits 
};
export default fetchForSearch