declare module 'adm-zip' {
  export type IZipEntry = {
    entryName: string;
    isDirectory: boolean;
    getData: () => Buffer;
  };

  export default class AdmZip {
    constructor(data?: Buffer | string);
    getEntries(): IZipEntry[];
    extractAllTo(targetPath: string, overwrite?: boolean): void;
  }
}
