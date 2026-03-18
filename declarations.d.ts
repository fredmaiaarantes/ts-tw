declare module "meteor/react-meteor-data/suspense" {
  import { Mongo } from "meteor/mongo";

  export function useSubscribe(name: string, ...args: any[]): void;
  export function useFind<T>(
    collection: Mongo.Collection<T>,
    args: [Mongo.Selector<T>?, Mongo.Options<T>?],
    deps?: any[]
  ): T[];
  export function useTracker<T>(
    key: string,
    reactiveFn: (computation?: any) => T | Promise<T>,
    deps?: any[],
    options?: { skipUpdate?: (prev: T, next: T) => boolean }
  ): T;
}
