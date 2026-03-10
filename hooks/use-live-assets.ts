import { useQuery } from "@tanstack/react-query"
import { fetchLiveAssets } from "@/lib/live-api"

export const POLL_INTERVAL_MS = 3_000 // 3 seconds

export function useLiveAssets() {
  return useQuery({
    queryKey: ["live-assets"],
    queryFn: fetchLiveAssets,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
    refetchIntervalInBackground: false,
  })
}
