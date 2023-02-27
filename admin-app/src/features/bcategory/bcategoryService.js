import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { config } from "../../utils/axiosconfig";

const getBlogCategories = async () => {
  const response = await axios.get(`${base_url}bcategory/`);

  return response.data;
};
const createBlogCategory = async (bcat) => {
  const response = await axios.post(`${base_url}bcategory/`, bcat, config);

  return response.data;
};
const updateBlogCategory = async (blogCat) => {
  const response = await axios.put(
    `${base_url}bcategory/${blogCat.id}`,
    { title: blogCat.blogCatData.title },
    config
  );

  return response.data;
};
const getBlogCategory = async (id) => {
  const response = await axios.get(`${base_url}bcategory/${id}`, config);

  return response.data;
};

const deleteBlogCategory = async (id) => {
  const response = await axios.delete(`${base_url}bcategory/${id}`, config);

  return response.data;
};
const bCategoryService = {
  getBlogCategories,
  createBlogCategory,
  getBlogCategory,
  deleteBlogCategory,
  updateBlogCategory,
};

export default bCategoryService;
