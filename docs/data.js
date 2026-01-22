// ---- DATA ----
export const SS = { type: "SS", title: "160x600" };
export const BB = { type: "BB", title: "300x250" };
export const DBB = { type: "DBB", title: "300x600" };
export const M320 = { type: { w: 320, h: 50 }, title: "320x50" };
export const LB = { type: "LB", title: "728x90" };
export const M970x250 = { type: { w: 970, h: 250 }, title: "970x250" };

export const data = {
  title: "PROLINE KAMBI",
  banners: [
    {
      title: "Same Game Parlay",
      list: [
        { ...SS, path: "" },
        { ...BB, path: "" },
        { ...DBB, path: "" },
        { ...M320, path: "" },
        { ...LB, path: "" },
        { ...M970x250, path: "" },
      ],
    },
    {
      title: "Early Payouts",
      list: [
        { ...SS, path: "" },
        { ...BB, path: "" },
        { ...DBB, path: "" },
        { ...M320, path: "" },
        { ...LB, path: "" },
        { ...M970x250, path: "" },
      ],
    },
    {
      title: "Plus Betting Easier",
      list: [
        { ...SS, path: "plusBettingEasier_160x600" },
        { ...BB, path: "plusBettingEasier_300x250" },
        { ...DBB, path: "plusBettingEasier_300x600" },
        { ...M320, path: "plusBettingEasier_320x50" },
        { ...LB, path: "plusBettingEasier_728x90" },
        { ...M970x250, path: "plusBettingEasier_970x250" },
      ],
    },
    {
      title: "Play In Store",
      list: [
        { ...SS, path: "playInStore_160x600" },
        { ...BB, path: "playInStore_300x250" },
        { ...DBB, path: "playInStore_300x600" },
        { ...M320, path: "playInStore_320x50" },
        { ...LB, path: "plusBettingEasier_728x90" },
        { ...M970x250, path: "plusBettingEasier_970x250" },
      ],
    },
  ],
};
