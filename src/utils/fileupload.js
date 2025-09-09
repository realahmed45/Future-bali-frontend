import axios from "axios";
export const uploadFileToServer = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:5000/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    return response.data.filePath;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
