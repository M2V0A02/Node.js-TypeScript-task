export default interface BICDirectoryEntryType {
  $: {
    BIC: number;
  };
  ParticipantInfo: ParticipantInfoType[];
  Accounts: AccountsType[];
}

interface ParticipantInfoType {
  $: {
    NameP: string;
  };
}

export interface AccountsType {
  $: {
    Account: number;
  };
}
