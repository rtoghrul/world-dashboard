'use client'

import { ExternalLink, PiggyBank, Utensils, Pill, Shirt, Car, Baby, Home, BadgeEuro, Gavel, Zap, Train, GraduationCap, Gift, Server, Landmark, Building2, Calculator, WalletCards, ShieldCheck } from 'lucide-react'

const groups = [
  { title: 'Food savings & food sharing', subtitle: 'Discounted restaurant, cafe and surplus food in Germany', icon: Utensils, items: [
    { name: 'Too Good To Go', url: 'https://www.toogoodtogo.com/de', note: 'Surprise bags from bakeries, cafes and supermarkets' },
    { name: 'ResQ Club', url: 'https://www.resq-club.com', note: 'Discounted restaurant meals and surplus food' },
    { name: 'OLIO', url: 'https://olioapp.com', note: 'Neighbours share free food and household items' },
    { name: 'Foodsharing.de', url: 'https://foodsharing.de', note: 'Free saved food from shops and foodsharing groups' },
    { name: 'Lieferando', url: 'https://www.lieferando.de', note: 'Delivery deals, vouchers and restaurant offers' },
    { name: 'Wolt', url: 'https://wolt.com/de', note: 'Food and grocery delivery offers in many cities' },
  ]},
  { title: 'Supermarket offers & leaflets', subtitle: 'Weekly food, household and grocery discounts', icon: Gift, items: [
    { name: 'Marktguru', url: 'https://www.marktguru.de', note: 'Supermarket offers, coupons and cashback promotions' },
    { name: 'KaufDA', url: 'https://www.kaufda.de', note: 'Digital leaflets from Aldi, Lidl, REWE, Kaufland and more' },
    { name: 'MeinProspekt', url: 'https://www.meinprospekt.de', note: 'Weekly brochures and nearby store promotions' },
    { name: 'Lidl Plus', url: 'https://www.lidl.de/c/lidl-plus', note: 'Weekly food coupons and digital receipts' },
    { name: 'Kaufland Card', url: 'https://www.kaufland.de/card.html', note: 'Supermarket discounts and points' },
    { name: 'REWE App', url: 'https://www.rewe.de/service/app/', note: 'Coupons, Payback and delivery service' },
  ]},
  { title: 'Cheap pharmacies & medicine price comparison', subtitle: 'Useful before buying OTC medicine, vitamins and family products', icon: Pill, items: [
    { name: 'DocMorris', url: 'https://www.docmorris.de', note: 'Online pharmacy with delivery in Germany' },
    { name: 'Shop Apotheke / Redcare', url: 'https://www.shop-apotheke.com', note: 'Large online pharmacy with frequent discounts' },
    { name: 'Medizinfuchs', url: 'https://www.medizinfuchs.de', note: 'Medicine price comparison for Germany' },
    { name: 'Medpex', url: 'https://www.medpex.de', note: 'Online pharmacy and health products' },
    { name: 'Aponeo', url: 'https://www.aponeo.de', note: 'Berlin-based online pharmacy' },
    { name: 'dm App', url: 'https://www.dm.de/services/services-im-markt/dm-app-1675614', note: 'Coupons for baby, health, cosmetics and household' },
  ]},
  { title: 'Cheap clothes, furniture & home items', subtitle: 'Second-hand, nearly free items and family-friendly shopping', icon: Shirt, items: [
    { name: 'Kleinanzeigen', url: 'https://www.kleinanzeigen.de', note: 'Furniture, electronics, baby items and local deals' },
    { name: 'Vinted', url: 'https://www.vinted.de', note: 'Second-hand clothes, kids clothes and branded items' },
    { name: 'Nebenan.de', url: 'https://nebenan.de', note: 'Neighbourhood offers, free items and local help' },
    { name: 'Facebook Marketplace', url: 'https://www.facebook.com/marketplace', note: 'Local used items and almost-free furniture' },
    { name: 'Shpock', url: 'https://www.shpock.com', note: 'Used goods marketplace in Germany' },
    { name: 'Möbel Fundgrube', url: 'https://www.moebel-fundgrube.de', note: 'Discount furniture and home items' },
  ]},
  { title: 'Free stuff & giveaways', subtitle: 'Free furniture, toys, electronics and local sharing', icon: Gift, items: [
    { name: 'Kleinanzeigen: Zu verschenken', url: 'https://www.kleinanzeigen.de/s-zu-verschenken/c192', note: 'Free items: furniture, toys, electronics and household goods' },
    { name: 'Nebenan.de', url: 'https://nebenan.de', note: 'Neighbourhood free items, local help and community posts' },
    { name: 'Free Your Stuff Germany', url: 'https://www.facebook.com/search/groups/?q=free%20your%20stuff%20germany', note: 'Facebook groups for free items in German cities' },
    { name: 'Foodsharing.de', url: 'https://foodsharing.de', note: 'Free saved food from shops and private households' },
    { name: 'Fundbüro Deutschland', url: 'https://www.fundbuero.de', note: 'Lost-and-found items, sometimes auctioned cheaply' },
    { name: 'Gratis in Berlin', url: 'https://www.gratis-in-berlin.de', note: 'Free events and activities; useful concept for other cities too' },
  ]},
  { title: 'Cashback, price comparison & coupons', subtitle: 'Check these before buying anything online', icon: BadgeEuro, items: [
    { name: 'Idealo', url: 'https://www.idealo.de', note: 'Compare prices and set price alerts' },
    { name: 'CHECK24', url: 'https://www.check24.de', note: 'Compare insurance, internet, electricity and travel' },
    { name: 'Shoop', url: 'https://www.shoop.de', note: 'Cashback for online shopping' },
    { name: 'Payback', url: 'https://www.payback.de', note: 'Collect points at dm, REWE, Aral and more' },
    { name: 'DeutschlandCard', url: 'https://www.deutschlandcard.de', note: 'Alternative points program for shopping and fuel' },
    { name: 'MyDealz', url: 'https://www.mydealz.de', note: 'Community deals and discount codes' },
  ]},
  { title: 'Utilities, electricity, gas & internet', subtitle: 'Reduce monthly bills by comparing providers', icon: Zap, items: [
    { name: 'Verivox', url: 'https://www.verivox.de', note: 'Compare electricity, gas, internet, mobile and insurance' },
    { name: 'CHECK24 Strom & Gas', url: 'https://www.check24.de/strom-gas/', note: 'Electricity and gas tariff comparison' },
    { name: 'Finanztip Stromvergleich', url: 'https://www.finanztip.de/stromvergleich/', note: 'Consumer-friendly electricity comparison guidance' },
    { name: 'CHECK24 DSL', url: 'https://www.check24.de/dsl/', note: 'Internet provider and DSL/fiber comparison' },
    { name: 'Verivox Mobilfunk', url: 'https://www.verivox.de/handytarife/', note: 'Mobile tariff comparison' },
    { name: 'Bundesnetzagentur', url: 'https://www.bundesnetzagentur.de', note: 'Official consumer information for energy and telecom topics' },
  ]},
  { title: 'Family benefits & government support', subtitle: 'Money support for children, rent, parents and families', icon: Baby, items: [
    { name: 'Kindergeld', url: 'https://www.arbeitsagentur.de/familie-und-kinder/kindergeld', note: 'Official child benefit information and application' },
    { name: 'Elterngeld', url: 'https://familienportal.de/familienportal/familienleistungen/elterngeld', note: 'Parental allowance information and calculator' },
    { name: 'Kinderzuschlag', url: 'https://www.arbeitsagentur.de/familie-und-kinder/kinderzuschlag', note: 'Additional support for families with children' },
    { name: 'Wohngeld', url: 'https://www.bmwsb.bund.de/wohngeld', note: 'Housing benefit information for rent or ownership costs' },
    { name: 'Familienpass Hessen', url: 'https://familienpass.hessen.de', note: 'Discounts and benefits for families in Hessen' },
    { name: 'Bildungspaket', url: 'https://www.bmas.de/DE/Arbeit/Grundsicherung-Buergergeld/Bildungspaket/bildungspaket.html', note: 'School, lunch, sport and education support for children' },
  ]},
  { title: 'House & apartment buying in Germany', subtitle: 'Property search, mortgage, taxes, notary and buy-vs-rent tools', icon: Building2, items: [
    { name: 'Immobilienscout24', url: 'https://www.immobilienscout24.de', note: 'Largest property portal for buying houses and apartments' },
    { name: 'Immowelt', url: 'https://www.immowelt.de', note: 'Property listings for houses, apartments and investments' },
    { name: 'Immonet', url: 'https://www.immonet.de', note: 'Apartment and house search in Germany' },
    { name: 'Kleinanzeigen Immobilien', url: 'https://www.kleinanzeigen.de/s-immobilien/c195', note: 'Private and broker property listings; sometimes hidden deals' },
    { name: 'Dr. Klein Baufinanzierung', url: 'https://www.drklein.de', note: 'Mortgage comparison and financing advice' },
    { name: 'Interhyp', url: 'https://www.interhyp.de', note: 'Mortgage broker and rate comparison' },
    { name: 'CHECK24 Baufinanzierung', url: 'https://www.check24.de/baufinanzierung/', note: 'Mortgage comparison for property buyers' },
    { name: 'Baufi24', url: 'https://www.baufi24.de', note: 'Mortgage calculators and financing offers' },
  ]},
  { title: 'Home ownership savings & subsidies', subtitle: 'KfW, BAFA, energy renovation, solar and heat-pump savings', icon: Home, items: [
    { name: 'KfW Förderprodukte', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/', note: 'Official KfW subsidies and loans for property owners' },
    { name: 'BAFA Energie', url: 'https://www.bafa.de/DE/Energie/energie_node.html', note: 'Federal subsidies for heating and energy efficiency' },
    { name: 'Förderdatenbank', url: 'https://www.foerderdatenbank.de', note: 'Search government subsidies by topic and region' },
    { name: 'CO2online FördermittelCheck', url: 'https://www.co2online.de/foerdermittel/', note: 'Find renovation and energy-saving subsidies' },
    { name: 'Finanztip Gebäudeversicherung', url: 'https://www.finanztip.de/wohngebaeudeversicherung/', note: 'Home building insurance guidance' },
    { name: 'Verbraucherzentrale Energieberatung', url: 'https://www.verbraucherzentrale-energieberatung.de', note: 'Independent energy advice for homes' },
  ]},
  { title: 'Property calculators & hidden purchase costs', subtitle: 'Estimate total cost before buying a home', icon: Calculator, items: [
    { name: 'Notar.de', url: 'https://www.notar.de', note: 'Official notary search and information' },
    { name: 'Interhyp Nebenkostenrechner', url: 'https://www.interhyp.de/ratgeber/kaufnebenkosten-rechner/', note: 'Calculate notary, land registry, broker and tax costs' },
    { name: 'Dr. Klein Budgetrechner', url: 'https://www.drklein.de/budgetrechner.html', note: 'Estimate affordable property budget' },
    { name: 'Finanztip Baufinanzierung', url: 'https://www.finanztip.de/baufinanzierung/', note: 'Independent mortgage and buying guidance' },
    { name: 'Hausfrage Immobilienbewertung', url: 'https://www.hausfrage.de/immobilienbewertung/', note: 'Property valuation estimate before buying or selling' },
    { name: 'Boris Hessen', url: 'https://www.geoportal.hessen.de', note: 'Official land value and property map resources for Hessen' },
  ]},
  { title: 'Tax refund & personal finance tools', subtitle: 'Tax returns, bank bonuses and money optimization', icon: WalletCards, items: [
    { name: 'ELSTER', url: 'https://www.elster.de', note: 'Official German tax portal' },
    { name: 'WISO Steuer', url: 'https://www.buhl.de/steuer/', note: 'Popular paid tax return software' },
    { name: 'Taxfix', url: 'https://taxfix.de', note: 'Mobile tax return app' },
    { name: 'Smartsteuer', url: 'https://www.smartsteuer.de', note: 'Online tax return tool' },
    { name: 'SteuerGo', url: 'https://www.steuergo.de', note: 'Online tax return assistant' },
    { name: 'Finanztip Girokonto', url: 'https://www.finanztip.de/girokonto/', note: 'Bank account comparison and switching tips' },
  ]},
  { title: 'Investments & wealth building', subtitle: 'ETF research, brokers, calculators and long-term planning', icon: Landmark, items: [
    { name: 'JustETF', url: 'https://www.justetf.com/de/', note: 'ETF comparison, savings plans and portfolio ideas' },
    { name: 'Trade Republic', url: 'https://traderepublic.com/de-de', note: 'Broker for stocks, ETFs and savings plans' },
    { name: 'Scalable Capital', url: 'https://de.scalable.capital', note: 'Broker and robo-advisor with ETF savings plans' },
    { name: 'Finanztip Geldanlage', url: 'https://www.finanztip.de/geldanlage/', note: 'Independent investing guidance' },
    { name: 'Finanzen.net', url: 'https://www.finanzen.net', note: 'Market data, stocks, ETFs and news' },
    { name: 'Portfolio Performance', url: 'https://www.portfolio-performance.info', note: 'Free portfolio tracking software' },
  ]},
  { title: 'Car, fuel & travel savings', subtitle: 'Useful for family trips, parking and fuel', icon: Car, items: [
    { name: 'Clever Tanken', url: 'https://www.clever-tanken.de', note: 'Compare fuel prices nearby' },
    { name: 'ADAC Drive', url: 'https://www.adac.de/services/apps/', note: 'Fuel prices, route help and mobility tools' },
    { name: 'Parkopedia', url: 'https://www.parkopedia.de', note: 'Compare parking prices and availability' },
    { name: 'AutoUncle', url: 'https://www.autouncle.de', note: 'Used car price comparison' },
    { name: 'DAT Bewertung', url: 'https://www.dat.de/gebrauchtfahrzeugwerte/', note: 'Vehicle valuation and market value checks' },
    { name: 'Mobile.de', url: 'https://www.mobile.de', note: 'Used car search and market comparison' },
  ]},
  { title: 'Transport & travel savings', subtitle: 'Cheap trains, buses, flights and holidays', icon: Train, items: [
    { name: 'Deutschlandticket', url: 'https://www.deutschlandticket.de', note: 'Monthly nationwide local transport ticket' },
    { name: 'DB Sparpreis Finder', url: 'https://www.bahn.de/angebot/sparpreis-flexpreis/super-sparpreis', note: 'Cheap train tickets when booked early' },
    { name: 'FlixBus', url: 'https://www.flixbus.de', note: 'Low-cost buses and trains in Europe' },
    { name: 'Skyscanner', url: 'https://www.skyscanner.de', note: 'Flight price comparison' },
    { name: 'Urlaubspiraten', url: 'https://www.urlaubspiraten.de', note: 'Holiday deals, flights and packages' },
    { name: 'Urlaubsguru', url: 'https://www.urlaubsguru.de', note: 'Travel deals and family holiday offers' },
  ]},
  { title: 'Learning & certifications', subtitle: 'Free or affordable courses for career growth', icon: GraduationCap, items: [
    { name: 'openHPI', url: 'https://open.hpi.de', note: 'Free IT, AI and digital courses with certificates' },
    { name: 'Cisco Skills for All', url: 'https://www.netacad.com/courses/all-courses', note: 'Networking, cybersecurity and IT courses' },
    { name: 'Coursera', url: 'https://www.coursera.org', note: 'University and professional certificates' },
    { name: 'edX', url: 'https://www.edx.org', note: 'University-level courses and certificates' },
    { name: 'FutureLearn', url: 'https://www.futurelearn.com', note: 'Free-to-audit courses and certificates' },
    { name: 'Udemy Deals', url: 'https://www.udemy.com', note: 'Wait for discounts before buying courses' },
  ]},
  { title: 'Auctions & government deals', subtitle: 'German GovDeals-style auctions for surplus, seized and industrial equipment', icon: Gavel, items: [
    { name: 'Zoll-Auktion', url: 'https://www.zoll-auktion.de', note: 'Official German public auctions: customs, police, cities, universities and surplus goods' },
    { name: 'Justiz-Auktion', url: 'https://www.justiz-auktion.de', note: 'Court and justice auctions: seized items, electronics, bikes, tools and more' },
    { name: 'Deutsche Internet Auktion', url: 'https://www.deutsche-internet-auktion.de', note: 'Municipal and public-sector auctions for vehicles, IT, furniture and equipment' },
    { name: 'Troostwijk Auctions', url: 'https://www.troostwijkauctions.com/de', note: 'Industrial auctions: servers, workshop tools, machinery, warehouse and office equipment' },
    { name: 'Surplex', url: 'https://www.surplex.com/de', note: 'Used industrial machines, technical equipment, CNC and factory liquidations' },
    { name: 'VDM Versteigerungen', url: 'https://www.vdm-versteigerungen.de', note: 'Insolvency and industrial auctions with machines, electronics and business equipment' },
    { name: 'Fundbüro Deutschland', url: 'https://www.fundbuero.de', note: 'Lost-and-found items from cities and transport operators' },
    { name: 'Auktionshaus Karhausen', url: 'https://www.karhausen.de', note: 'IT assets, office equipment, industrial electronics and business liquidations' },
  ]},
  { title: 'Data center & IT surplus deals', subtitle: 'Enterprise hardware, servers, networking, UPS and homelab equipment', icon: Server, items: [
    { name: 'ServerShop24', url: 'https://www.servershop24.de', note: 'Refurbished servers, storage and enterprise hardware' },
    { name: 'IT-Markt', url: 'https://www.it-markt.de', note: 'Used IT hardware marketplace' },
    { name: 'AfB Shop', url: 'https://www.afbshop.de', note: 'Refurbished laptops, PCs and monitors with social impact' },
    { name: 'GreenPanda', url: 'https://www.greenpanda.de', note: 'Refurbished business laptops and IT equipment' },
    { name: 'Rebuy', url: 'https://www.rebuy.de', note: 'Used electronics, phones, consoles and laptops' },
    { name: 'Back Market', url: 'https://www.backmarket.de', note: 'Refurbished electronics marketplace' },
  ]},
  { title: 'Insurance savings', subtitle: 'Compare mandatory and optional German insurance', icon: ShieldCheck, items: [
    { name: 'CHECK24 Versicherungen', url: 'https://www.check24.de/versicherungen/', note: 'Compare liability, car, legal, home and travel insurance' },
    { name: 'Verivox Versicherungen', url: 'https://www.verivox.de/versicherungen/', note: 'Insurance comparisons and tariff checks' },
    { name: 'Finanztip Haftpflicht', url: 'https://www.finanztip.de/haftpflichtversicherung/', note: 'Independent private liability insurance guidance' },
    { name: 'Finanztip Rechtsschutz', url: 'https://www.finanztip.de/rechtsschutzversicherung/', note: 'Legal insurance guidance' },
    { name: 'Clark', url: 'https://www.clark.de', note: 'Digital insurance manager and contract overview' },
    { name: 'Getsafe', url: 'https://www.hellogetsafe.com/de-de', note: 'Digital insurance provider' },
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
          <h2 className="text-2xl font-bold gradient-text-static">Germany Savings Hub</h2>
          <p className="text-xs text-[#8b8b9e]">Savings, real estate, benefits, finance, utilities, auctions and family tools</p>
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
          Tip: before buying property, calculate Kaufnebenkosten first. Before monthly contracts, compare Verivox/CHECK24. Before online buying, check Idealo/MyDealz plus Shoop/Payback cashback.
        </p>
      </div>
    </div>
  )
}
