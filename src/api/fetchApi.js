const BASE_URL = 'http://leviatan.test/api/'

async function fetchApi(url, options = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json',
      ...options.headers,
    });

    const token = localStorage.getItem('jwtToken');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.text();
    throw new Error(error);
  }

    export default fetchApi;