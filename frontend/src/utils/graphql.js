import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';

const useClient = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from local storage
    const newClient = new GraphQLClient('http://localhost:4000/graphql', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
    setClient(newClient);
  }, []); // Run once on component mount

  return client;
};

export default useClient;
