/**
 * The only file that imports `@tanstack/react-query`. Hooks, providers and layouts import from here, so
 * the library is wired in one place (an ESLint rule rejects direct imports) and a version change, a
 * wrapper or a devtools hook touches one file.
 */
export {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  dehydrate,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
