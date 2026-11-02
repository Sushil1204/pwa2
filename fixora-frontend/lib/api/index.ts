import type { CustomerRepository } from "@/lib/api/repository";
import { devRepository } from "@/lib/api/dev-adapter";

/**
 * API entry point. Today the development adapter implements
 * CustomerRepository; point `repository` at an HTTP client for
 * https://api.fixora.com/api/v1 without changing any screen.
 */
export const repository: CustomerRepository = devRepository;

export { RepositoryError } from "@/lib/api/dev-adapter";
