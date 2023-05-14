import fetch, { Response } from "node-fetch";
import AdmZip from "adm-zip";
import { IZipEntry } from "adm-zip";

fetch("http://www.cbr.ru/s/newbik")
  .then((response: Response) => response.arrayBuffer())
  .then((buffer: ArrayBuffer) => {
    const zip = new AdmZip(Buffer.from(buffer));
    zip.getEntries().forEach((entry: IZipEntry) => {
        console.log(entry.entryName)
    })
  })
  .catch((error: Error) => {
    console.error(error);
  });
