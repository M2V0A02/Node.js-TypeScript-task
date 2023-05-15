import BICAccountsType from "./BICAccountsType.js"

export default interface BICRequiredDataType {
    bic: number,
    name: string,
    corrAccounts: BICAccountsType[]
}