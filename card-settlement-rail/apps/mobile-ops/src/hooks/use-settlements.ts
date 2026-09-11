import { useQuery } from "@tanstack/react-query";
import { api, type Settlement } from "../lib/api";

export function useSettlements() {
  return useQuery<Settlement[]>({
    queryKey: ["settlements"],
    queryFn: api.settlements.list,
  });
}

export function useSettlement(id: string | undefined) {
  return useQuery<Settlement>({
    queryKey: ["settlements", id],
    queryFn: () => api.settlements.get(id!),
    enabled: Boolean(id),
  });
}
