import BICAccountsType from "./BicAccountsType.js"

export default interface BICRequiredDataType {
    bic: number,
    name: string,
    corrAccounts: BICAccountsType[]
}