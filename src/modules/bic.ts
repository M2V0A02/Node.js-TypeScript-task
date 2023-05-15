import BICDirectoryEntryType, {AccountsType} from "../types/BICDirectoryEntryType.js";
import BICAccountsType from "../types/BICAccountsType.js";
import BICRequiredDataType from "../types/BICRequiredDataType.js";
import fetch, { Response } from "node-fetch";
import AdmZip from "adm-zip";
import xml2js from "xml2js";
import iconv from "iconv-lite";

export default async (url: string): Promise<BICRequiredDataType[]> => {
  let buffer:ArrayBuffer;
  try {
    const response: Response = await fetch(url);
    buffer = await response.arrayBuffer();
  } catch(error: any) {
    throw error;
  }
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