const API_BASE_URL = "https://govgazette-api.africacodefoundry.com";

export const getDocuments = async () => {
  try {
    console.log("Attempting to fetch documents from:", `${API_BASE_URL}/api/documents`); // DEBUGGING
    const response = await fetch(`${API_BASE_URL}/api/documents`);

    console.log("API response status:", response.status); // DEBUGGING

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response not OK. Status:", response.status, "Response text:", errorText); // DEBUGGING
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log("Successfully fetched and parsed JSON data:", data); // DEBUGGING
    return data;

  } catch (error) {
    console.error("Critical error in getDocuments():", error); // DEBUGGING
    throw error;
  }
};

export const getTenders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenders`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tenders:", error);
    throw error;
  }
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source_type", "text");

  try {
    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

export const searchGazettes = async (query: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gazette/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching gazettes:", error);
    throw error;
  }
};