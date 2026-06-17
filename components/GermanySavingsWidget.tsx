'use client'

import { ExternalLink, PiggyBank, Utensils, Pill, Shirt, Car, Baby, Home, BadgeEuro } from 'lucide-react'

const groups = [
  { title: 'Food savings & food sharing', subtitle: 'Discounted restaurant, cafe and surplus food in Germany', icon: Utensils, items: [
    { name: 'Too Good To Go', url: 'https://www.toogoodtogo.com/de', note: 'Surprise bags from bakeries, cafes and supermarkets' },
    { name: 'ResQ Club', url: 'https://www.resq-club.com', note: 'Discounted restaurant meals and surplus food' },
    { name: 'OLIO', url: 'https://olioapp.com', note: 'Neighbours share free food and household items' },
    { name: 'Foodsharing.de', url: 'https://foodsharing.de', note: 'Free saved food from shops and foodsharing groups' },
    { name: 'Lieferando', url: 'https://www.lieferando.de', note: 'Delivery deals, vouchers and restaurant offers' },
    { name: 'Wolt', url: 'https://wolt.com/de', note: 'Food and grocery delivery offers in many cities' },
  ]},
  { title: 'Cheap pharmacies & medicine price comparison', subtitle: 'Useful before buying OTC medicine, vitamins and family products', icon: Pill, items: [
    { name: 'DocMorris', url: 'https://www.docmorris.de', note: 'Online pharmacy with delivery in Germany' },
    { name: 'Shop Apotheke / Redcare', url: 'https://www.shop-apotheke.com', note: 'Large online pharmacy with frequent discounts' },
    { name: 'Redcare Pharmacy', url: 'https://www.redcare-pharmacy.com', note: 'European online pharmacy brand' },
    { name: 'Medizinfuchs', url: 'https://www.medizinfuchs.de', note: 'Medicine price comparison for Germany' },
    { name: 'Medpex', url: 'https://www.medpex.de', note: 'Online pharmacy and health products' },
    { name: 'Aponeo', url: 'https://www.aponeo.de', note: 'Berlin-based online pharmacy' },
  ]},
  { title: 'Cheap clothes, furniture & home items', subtitle: 'Second-hand, nearly free items and family-friendly shopping', icon: Shirt, items: [
    { name: 'Kleinanzeigen', url: 'https://www.kleinanzeigen.de', note: 'Furniture, electronics, baby items and local deals' },
    { name: 'Vinted', url: 'https://www.vinted.de', note: 'Second-hand clothes, kids clothes and branded items' },
    { name: 'Nebenan.de', url: 'https://nebenan.de', note: 'Neighbourhood offers, free items and local help' },
    { name: 'Facebook Marketplace', url: 'https://www.facebook.com/marketplace', note: 'Local used items and almost-free furniture' },
    { name: 'Shpock', url: 'https://www.shpock.com', note: 'Used goods marketplace in Germany' },
    { name: 'Möbel Fundgrube', url: 'https://www.moebel-fundgrube.de', note: 'Discount furniture and home items' },
  ]},
  { title: 'Cashback, price comparison & coupons', subtitle: 'Check these before buying anything online', icon: BadgeEuro, items: [
    { name: 'Idealo', url: 'https://www.idealo.de', note: 'Compare prices and set price alerts' },
    { name: 'CHECK24', url: 'https://www.check24.de', note: 'Compare insurance, internet, electricity and travel' },
    { name: 'Shoop', url: 'https://www.shoop.de', note: 'Cashback for online shopping' },
    { name: 'Payback', url: 'https://www.payback.de', note: 'Collect points at dm, REWE, Aral and more' },
    { name: 'MyDealz', url: 'https://www.mydealz.de', note: 'Community deals and discount codes' },
    { name: 'Gutscheinpony', url: 'https://www.gutscheinpony.de', note: 'Coupons and voucher codes' },
  ]},
  { title: 'Family, groceries & everyday savings', subtitle: 'Very useful for families living in Germany', icon: Baby, items: [
    { name: 'dm App', url: 'https://www.dm.de/services/services-im-markt/dm-app-1675614', note: 'Coupons for baby, health, cosmetics and household' },
    { name: 'Rossmann App', url: 'https://www.rossmann.de/de/app', note: 'Regular 10% coupons and family discounts' },
    { name: 'Lidl Plus', url: 'https://www.lidl.de/c/lidl-plus/s10023043', note: 'Weekly food coupons and digital receipts' },
    { name: 'Kaufland Card', url: 'https://www.kaufland.de/card.html', note: 'Supermarket discounts and points' },
    { name: 'REWE App', url: 'https://www.rewe.de/service/app/', note: 'Coupons, Payback and delivery service' },
    { name: 'Bring!', url: 'https://www.getbring.com', note: 'Shared shopping lists for family grocery planning' },
  ]},
  { title: 'Car, fuel & travel savings', subtitle: 'Useful for family trips, parking and fuel', icon: Car, items: [
    { name: 'Clever Tanken', url: 'https://www.clever-tanken.de', note: 'Compare fuel prices nearby' },
    { name: 'ADAC Drive', url: 'https://www.adac.de/services/apps/adac-drive/', note: 'Fuel prices, route help and mobility tools' },
    { name: 'Parkopedia', url: 'https://www.parkopedia.de', note: 'Compare parking prices and availability' },
    { name: 'EasyPark', url: 'https://www.easypark.com/de', note: 'Pay parking by phone in many German cities' },
    { name: 'Skyscanner', url: 'https://www.skyscanner.de', note: 'Flight price comparison' },
    { name: 'Omio', url: 'https://www.omio.de', note: 'Compare trains, buses and flights' },
  ]},
]

export default function GermanySavingsWidget() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <PiggyBank className="w-5 h-5 text-emerald-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text-static">Germany Savings Apps</h2>
          <p className="text-xs text-[#8b8b9e]">Food, pharmacies, clothes, family, car and cashback tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {groups.map(group => {
          const Icon = group.icon
          return (
            <section key={group.title} className="rounded-2xl border border-white/[0.06] bg-[#0a0a10]/80 p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{group.title}</h3>
                  <p className="text-[#6b6b80] text-xs mt-0.5">{group.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map(item => (
                  <a key={item.name} href={item.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/25 p-3 transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-white text-xs font-semibold">{item.name}</h4>
                      <ExternalLink className="w-3.5 h-3.5 text-[#6b6b80] group-hover:text-emerald-300" />
                    </div>
                    <p className="text-[#8b8b9e] text-[11px] mt-1 leading-relaxed">{item.note}</p>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-4 flex items-start gap-3">
        <Home className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-100/80 leading-relaxed">
          Tip: before buying, check Idealo/MyDealz first, then cashback via Shoop or Payback, then compare delivery cost. For medicines, compare Medizinfuchs before ordering.
        </p>
      </div>
    </div>
  )
}
