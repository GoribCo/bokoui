/* eslint-disable react-hooks/rules-of-hooks -- the methods below are thin wrappers that only the hooks in hooks/use-*.ts call */
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

/**
 * Base of every data hook. The `use-*.ts` files define a class that extends this one and call
 * `this.useQuery`, `this.useMutation` and `this.useQueryClient`, so TanStack Query is imported here
 * and nowhere else in the hooks.
 */
export abstract class BaseQuery {
  /** Keeps the previous result on screen while the next one loads (paging, filtering). */
  protected readonly keepPreviousData = keepPreviousData;

  protected useQuery<TData, TError = Error>(options: UseQueryOptions<TData, TError>) {
    return useQuery(options);
  }

  protected useMutation<TData, TError = Error, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>,
  ) {
    return useMutation(options);
  }

  protected useQueryClient() {
    return useQueryClient();
  }
}
