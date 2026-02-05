declare module 'ali-oss' {
  type PutOptions = {
    mime?: string;
    headers?: Record<string, string>;
  };

  export default class OSS {
    constructor(config: Record<string, unknown>);
    put(key: string, body: Buffer | Uint8Array, options?: PutOptions): Promise<unknown>;
    delete(key: string): Promise<unknown>;
  }
}
