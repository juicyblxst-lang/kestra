export interface ServiceHandle { readonly name: string; readonly close: () => Promise<void>; }
export interface InMemoryHarness { readonly services: ReadonlyMap<string, ServiceHandle>; readonly close: () => Promise<void>; }
export const bootInMemoryHarness = (services: readonly ServiceHandle[] = []): InMemoryHarness => {
  const map = new Map(services.map(service => [service.name, service] as const));
  return { services: map, close: async () => { await Promise.all([...map.values()].map(service => service.close())); } };
};
