export type SentEvent<
  Name extends string = string,
  Attributes extends Record<string, unknown> = Record<string, unknown>
> = {
  name: Name;
  attributes: Attributes;
  anonymousId?: string;
  userId?: string;
  meta?: Record<string, unknown>;
  timestamp: number;
};
