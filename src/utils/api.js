const api = {
  authToken: () => {
    return localStorage.getItem("authToken");
  },
  setAuthToken: (token) => {
    localStorage.setItem("authToken", token);
  },
  fetch: async (url, options) => {
    let data = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: api.authToken() ? `Bearer ${api.authToken()}` : "",
      },
    };
    return await fetch(`${process.env.REACT_APP_API_URL}/${url}`, data).then(
      async (resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return await resp.json();
      }
    );
  },
};

export default api;
