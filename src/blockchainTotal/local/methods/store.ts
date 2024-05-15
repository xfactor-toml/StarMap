import { fastDataServerUrl } from "~/blockchainTotal/config/network";
import { TelegramAuthData } from "~/blockchainTotal/types";

export interface StoreItem {
    id: number;
    item: string;
    type: string;
    rareness: string;
    description?: string;
    img_preview?: string;
    img_full?: string;
    per_user: number | null;
    total_count: number | null;
    cost: number;
    currency: string;
  }
  
export interface StoreItemBalance {
    id: number;
    user_name: string;
    item_id: number;
    balance: number;
  }

export interface BalanceRequestData {
    login: string;
    itemId: number;
}

export interface IsAllowBuyRequestData {
    login: string;
    itemId: number;
    amount: number;
}

export interface BuyRequestData {
    telegramData: TelegramAuthData;
    itemId: number;
    amount: number;
}

export interface CheckResponce {
    ok: boolean;
    error: string;
}

export async function GetStoreItems(): Promise<StoreItem[]> {
    return new Promise((resolve, reject) => {
        fetch(fastDataServerUrl.concat('api/storeitems'))
            .then(res => {
                if (res.status !== 200) {
                    reject("Failed to get data")
                }
                return res.json()
            }).then((res: { items: StoreItem[] }) => {
                resolve(res.items)
            })
    })
}

export async function GetUserItemBalance (data: BalanceRequestData) : Promise<number> {
    return new Promise((resolve, reject) => {
        fetch(fastDataServerUrl.concat('api/store/userbalance'), {
           method: 'post',
           headers: {
             "Content-Type": "application/json"
           },
           body: JSON.stringify({
               login: data.login, 
               itemId: data.itemId
           })
           }).then(res =>{ 
                if (res.status !== 200) {
                    reject("Failed to get data")
                }
                return res.json()
           }).then((res: { balance: number}) =>{ 
              resolve(res.balance)
           })
    })
}

export async function IsAvailableToBuy (data: IsAllowBuyRequestData) : Promise<CheckResponce> {
    return new Promise((resolve, reject) => {
        fetch(fastDataServerUrl.concat('api/store/isavailable'), {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                login: data.login, 
                itemId: data.itemId,
                amount: data.amount
        })
    }).then(res =>{ 
        if (res.status !== 200) {
            reject("Failed to get data")
        }
        return res.json()
    }).then((res: CheckResponce) => {
        resolve(res)
    })
    })
}

export async function BuyItem (data: BuyRequestData) : Promise<CheckResponce> {
    return new Promise((resolve, reject) => {
        fetch(fastDataServerUrl.concat('api/store/buy'), {
             method: 'post',
             headers: {
                "Content-Type": "application/json"
             },
             body: JSON.stringify({
                 telegramData: data.telegramData, 
                 itemId: data.itemId, 
                 amount: data.amount
            })
        }).then(res =>{ 
            if (res.status !== 200) {
                reject("Failed to get data")
            }
            return res.json()
        }).then((res: CheckResponce)=> {
            resolve(res)
        })
    })
}