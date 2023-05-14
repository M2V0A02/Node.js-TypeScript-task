import fetch, { Response } from "node-fetch";
import AdmZip from "adm-zip";
import xml2js from "xml2js";
import iconv from "iconv-lite";
import BICDirectoryEntryType, {AccountsType} from "../types/BicDirectoryEntryType.js";
import BICAccountsType from "../types/BicAccountsType.js";
import BICRequiredDataType from "../types/BicRequiredDataType.js";

export default async (url: string): Promise<BICRequiredDataType[]> => {
  const response: Response = await fetch(url);
  const buffer: ArrayBuffer = await response.arrayBuffer();
  const outputBICS: BICRequiredDataType[] = [];
  const zip = new AdmZip(Buffer.from(buffer));
  const xmlBICS = iconv.decode(zip.getEntries()[0].getData(), "windows-1251");
  const parser = new xml2js.Parser();
  parser.parseString(xmlBICS, (err: Error | null, result: any) => {
    if (err) {
      console.error(err);
    } else {
      const BICSDirectoryEntry = result[Object.keys(result)[0]].BICDirectoryEntry;
      BICSDirectoryEntry.forEach((BICDirectoryEntry: BICDirectoryEntryType) => {
        if (BICDirectoryEntry.Accounts != undefined) {
          const BIC = BICDirectoryEntry.$.BIC;
          const name = BICDirectoryEntry.ParticipantInfo[0].$.NameP;
          const corrAccounts:BICAccountsType[] = [];
          BICDirectoryEntry.Accounts.forEach((account: AccountsType) => corrAccounts.push({
            account: account.$.Account
          }));
          outputBICS.push({ bic: BIC, name: name, corrAccounts: corrAccounts });
        }
      });
    }
  });
  return outputBICS;
};