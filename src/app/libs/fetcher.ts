const fetcher = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  };
  
  export default fetcher;