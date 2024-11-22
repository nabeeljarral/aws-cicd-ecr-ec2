// import axios from "axios";
// import awesomeAlert from "@/utils/functions/alert";
// import {AlertTypeEnum} from "@/utils/enums/alertType";
//
// interface IInitiateDynamicTransaction {
//     "StatusCode": number,
//     "status": string,
//     "refid": string,
//     "message": string,
//     "qr_Link": string,
//     "qr_Link_type": string
// }
//
// const MID = "1748545937045613553"
// const requestingUserName = "PER174"
// const VPA = "Perfect.ent23@icici"
// const token = "638248507371915677"
//
// export const initiateDynamicTransaction = async (amount: number | string): Promise<IInitiateDynamicTransaction | undefined> => {
//     try {
//         const res = await axios.post(
//             'https://recopays.com//API/TransactionInitiate',
//             {
//                 "MID": MID,
//                 "amount": `${amount}`
//             }.toString(),
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                     'Authorization': `Bearer ${token}`
//                 }
//             }
//         );
//         awesomeAlert({
//             msg: res.data.message,
//             type:
//                 res.data.StatusCode === -1 ?
//                     AlertTypeEnum.error :
//                     AlertTypeEnum.success
//         });
//         return res.data
//     } catch (error: any) {
//         console.error(error)
//         // awesomeAlert( error);
//     }
// }
// export const vpaCollects = async (amount: number): Promise<IInitiateDynamicTransaction | undefined> => {
//     try {
//         const res = await axios.post('https://recopays.com//API/TransactionInitiate', {
//             "MID": MID,
//             "amount": `${amount}`
//         });
//         awesomeAlert({
//             msg: res.data.message,
//             type:
//                 res.data.StatusCode === -1 ?
//                     AlertTypeEnum.error :
//                     AlertTypeEnum.success
//         });
//         return res.data
//     } catch (error: any) {
//         console.error(error)
//         // awesomeAlert( error);
//     }
// }