import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import type { GraphQLError } from 'graphql';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  credentials: 'include',
});

// auth middleware
const authLink = setContext((_, { headers }) => {
  const token = cookies.get('access_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
});

// error middleware
const errorLink = onError((errorHandler) => {
  const { graphQLErrors, networkError } = errorHandler as {
    graphQLErrors?: readonly GraphQLError[];
    networkError?: Error | null;
  };

  if (graphQLErrors) {
    graphQLErrors.forEach((error: GraphQLError) => {
      console.error(
        `[GraphQL error]: Message: ${error.message}`,
        error.extensions
      );

      // Handle authentication errors
      if (error.extensions?.code === 'UNAUTHENTICATED') {
        cookies.remove('access_token', { path: '/' });
        cookies.remove('refresh_token', { path: '/' });
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
  }
});

// Apollo Client setup
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add cache policies for your queries if needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
