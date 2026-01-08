'use client';

import { apolloClient } from '@/lib/graphql/apollo-client';
import { ApolloProvider } from '@apollo/client/react';
import type { ReactNode } from 'react';

interface GraphQLProviderProps {
  children: ReactNode;
}

/**
 * GraphQL Provider Component
 * Wraps the application with Apollo Client context for Next.js App Router
 * This allows you to use GraphQL queries and mutations throughout your app
 */
export function GraphQLProvider({ children }: GraphQLProviderProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
