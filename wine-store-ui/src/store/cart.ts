import { create } from "zustand";

export type CartItem = { wineId:number; name:string; price:number; qty:number; };
type S = {
  items: CartItem[];
  add: (i: Omit<CartItem,"qty">) => void;
  remove: (id:number)=>void;
  setQty: (id:number, qty:number)=>void;
  clear: ()=>void;
}
export const useCart = create<S>((set)=>({
  items: [],
  add: (item)=>set(s=>{
    const f=s.items.find(x=>x.wineId===item.wineId);
    return f? {items: s.items.map(x=>x.wineId===item.wineId? {...x, qty:x.qty+1}:x)}
            : {items: [...s.items, {...item, qty:1}]};
  }),
  remove:(id)=>set(s=>({items:s.items.filter(x=>x.wineId!==id)})),
  setQty:(id,qty)=>set(s=>({items:s.items.map(x=>x.wineId===id? {...x, qty:Math.max(1,qty)}:x)})),
  clear:()=>set({items:[]})
}));
