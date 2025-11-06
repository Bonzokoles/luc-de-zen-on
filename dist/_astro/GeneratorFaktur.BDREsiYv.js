import{j as e}from"./jsx-runtime.DQGZxW1v.js";import{r as x}from"./index.yhVXtIVG.js";import{c as p}from"./createLucideIcon.B4xKocBx.js";import{F as m,D as A}from"./file-text.Bnyqzq66.js";import{T as $}from"./trash-2.DE8Buys8.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]],C=p("calculator",D);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],S=p("plus",P);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],F=p("save",I),L=()=>{const[s,l]=x.useState({invoiceNumber:`FV/${new Date().getFullYear()}/${String(Date.now()).slice(-6)}`,issueDate:new Date().toISOString().split("T")[0],saleDate:new Date().toISOString().split("T")[0],dueDate:new Date(Date.now()+12096e5).toISOString().split("T")[0],seller:{name:"",address:"",nip:"",email:"",phone:""},buyer:{name:"",address:"",nip:"",email:""},items:[],paymentMethod:"przelew",bankAccount:"",notes:""}),[o,u]=x.useState({netTotal:0,vatTotal:0,grossTotal:0});x.useEffect(()=>{const t=s.items.reduce((r,n)=>r+n.netAmount,0),a=s.items.reduce((r,n)=>r+n.vatAmount,0),i=s.items.reduce((r,n)=>r+n.grossAmount,0);u({netTotal:t,vatTotal:a,grossTotal:i})},[s.items]);const g=()=>{const t={id:`item-${Date.now()}`,name:"",quantity:1,unitPrice:0,vatRate:23,netAmount:0,vatAmount:0,grossAmount:0};l(a=>({...a,items:[...a.items,t]}))},y=t=>{l(a=>({...a,items:a.items.filter(i=>i.id!==t)}))},d=(t,a,i)=>{l(r=>({...r,items:r.items.map(n=>{if(n.id!==t)return n;const w={...n,[a]:i},f=a==="quantity"?Number(i):n.quantity,k=a==="unitPrice"?Number(i):n.unitPrice,z=a==="vatRate"?Number(i):n.vatRate,c=f*k,h=c*(z/100),T=c+h;return{...w,netAmount:c,vatAmount:h,grossAmount:T}})}))},j=()=>{localStorage.setItem("invoice-draft",JSON.stringify(s)),alert("✅ Szkic faktury został zapisany!")},b=()=>{const t=localStorage.getItem("invoice-draft");t?(l(JSON.parse(t)),alert("✅ Szkic faktury został wczytany!")):alert("❌ Brak zapisanego szkicu")},v=()=>`
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faktura ${s.invoiceNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      background: white;
      color: #000;
    }
    h1 {
      text-align: center;
      font-size: 28px;
      margin-bottom: 30px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .company-box {
      width: 45%;
      padding: 15px;
      border: 2px solid #000;
    }
    .company-box h2 {
      font-size: 14px;
      margin: 0 0 10px 0;
      font-weight: bold;
    }
    .company-box p {
      margin: 3px 0;
      font-size: 12px;
    }
    .dates {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      font-size: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #f0f0f0;
      font-weight: bold;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .totals {
      margin-top: 20px;
      width: 40%;
      margin-left: auto;
    }
    .totals table {
      font-size: 12px;
    }
    .totals .final-total {
      font-weight: bold;
      font-size: 14px;
      background: #f0f0f0;
    }
    .payment-info {
      margin-top: 30px;
      font-size: 12px;
    }
    .notes {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      font-size: 11px;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <h1>FAKTURA VAT</h1>
  <h2 style="text-align: center; font-size: 18px; margin: -20px 0 20px 0;">${s.invoiceNumber}</h2>

  <div class="header">
    <div class="company-box">
      <h2>SPRZEDAWCA:</h2>
      <p><strong>${s.seller.name||"[Nazwa firmy]"}</strong></p>
      <p>${s.seller.address||"[Adres]"}</p>
      <p><strong>NIP:</strong> ${s.seller.nip||"[NIP]"}</p>
      <p>Email: ${s.seller.email||"[Email]"}</p>
      <p>Tel: ${s.seller.phone||"[Telefon]"}</p>
    </div>

    <div class="company-box">
      <h2>NABYWCA:</h2>
      <p><strong>${s.buyer.name||"[Nazwa firmy/klienta]"}</strong></p>
      <p>${s.buyer.address||"[Adres]"}</p>
      <p><strong>NIP:</strong> ${s.buyer.nip||"[NIP]"}</p>
      <p>Email: ${s.buyer.email||"[Email]"}</p>
    </div>
  </div>

  <div class="dates">
    <div><strong>Data wystawienia:</strong> ${s.issueDate}</div>
    <div><strong>Data sprzedaży:</strong> ${s.saleDate}</div>
    <div><strong>Termin płatności:</strong> ${s.dueDate}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">Lp.</th>
        <th style="width: 35%;">Nazwa towaru/usługi</th>
        <th style="width: 10%;" class="text-center">Ilość</th>
        <th style="width: 12%;" class="text-right">Cena jedn. netto</th>
        <th style="width: 12%;" class="text-right">Wartość netto</th>
        <th style="width: 8%;" class="text-center">VAT %</th>
        <th style="width: 12%;" class="text-right">Kwota VAT</th>
        <th style="width: 12%;" class="text-right">Wartość brutto</th>
      </tr>
    </thead>
    <tbody>
      ${s.items.map((t,a)=>`
        <tr>
          <td class="text-center">${a+1}</td>
          <td>${t.name||"[Nazwa produktu/usługi]"}</td>
          <td class="text-center">${t.quantity}</td>
          <td class="text-right">${t.unitPrice.toFixed(2)} zł</td>
          <td class="text-right">${t.netAmount.toFixed(2)} zł</td>
          <td class="text-center">${t.vatRate}%</td>
          <td class="text-right">${t.vatAmount.toFixed(2)} zł</td>
          <td class="text-right">${t.grossAmount.toFixed(2)} zł</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td><strong>Razem netto:</strong></td>
        <td class="text-right">${o.netTotal.toFixed(2)} zł</td>
      </tr>
      <tr>
        <td><strong>Razem VAT:</strong></td>
        <td class="text-right">${o.vatTotal.toFixed(2)} zł</td>
      </tr>
      <tr class="final-total">
        <td><strong>RAZEM BRUTTO:</strong></td>
        <td class="text-right"><strong>${o.grossTotal.toFixed(2)} zł</strong></td>
      </tr>
    </table>
  </div>

  <div class="payment-info">
    <p><strong>Sposób płatności:</strong> ${s.paymentMethod==="przelew"?"Przelew bankowy":s.paymentMethod==="gotowka"?"Gotówka":"BLIK"}</p>
    ${s.paymentMethod==="przelew"&&s.bankAccount?`<p><strong>Numer konta:</strong> ${s.bankAccount}</p>`:""}
    <p><strong>Do zapłaty:</strong> <span style="font-size: 16px; font-weight: bold;">${o.grossTotal.toFixed(2)} zł</span></p>
  </div>

  ${s.notes?`
  <div class="notes">
    <strong>Uwagi:</strong><br>
    ${s.notes}
  </div>
  `:""}

  <div style="margin-top: 60px; display: flex; justify-content: space-between;">
    <div style="text-align: center; width: 40%;">
      <div style="border-top: 1px solid #000; padding-top: 5px;">Podpis wystawiającego</div>
    </div>
    <div style="text-align: center; width: 40%;">
      <div style="border-top: 1px solid #000; padding-top: 5px;">Podpis odbierającego</div>
    </div>
  </div>

  <p style="text-align: center; margin-top: 30px; font-size: 10px; color: #666;">
    Wygenerowano przez AI Biznes Start - ${new Date().toLocaleString("pl-PL")}
  </p>
</body>
</html>
    `,N=()=>{const t=window.open("","_blank");t&&(t.document.write(v()),t.document.close(),t.focus(),setTimeout(()=>{t.print()},250))};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-white mb-2",children:"Generator Faktur VAT"}),e.jsx("p",{className:"text-gray-300",children:"Twórz profesjonalne faktury zgodne z polskim prawem"})]}),e.jsxs("div",{className:"flex flex-wrap gap-3 justify-center",children:[e.jsxs("button",{onClick:j,className:"btn-secondary flex items-center gap-2",children:[e.jsx(F,{className:"w-4 h-4"}),"Zapisz szkic"]}),e.jsxs("button",{onClick:b,className:"btn-secondary flex items-center gap-2",children:[e.jsx(m,{className:"w-4 h-4"}),"Wczytaj szkic"]}),e.jsxs("button",{onClick:N,className:"btn-primary flex items-center gap-2",disabled:s.items.length===0,children:[e.jsx(A,{className:"w-4 h-4"}),"Podgląd i Drukuj"]})]}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"card",children:[e.jsx("h2",{className:"text-xl font-bold text-white mb-4",children:"📤 Sprzedawca (Ty)"}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("input",{type:"text",placeholder:"Nazwa firmy",value:s.seller.name,onChange:t=>l(a=>({...a,seller:{...a.seller,name:t.target.value}})),className:"input-field"}),e.jsx("input",{type:"text",placeholder:"Adres (ulica, kod, miasto)",value:s.seller.address,onChange:t=>l(a=>({...a,seller:{...a.seller,address:t.target.value}})),className:"input-field"}),e.jsx("input",{type:"text",placeholder:"NIP",value:s.seller.nip,onChange:t=>l(a=>({...a,seller:{...a.seller,nip:t.target.value}})),className:"input-field"}),e.jsx("input",{type:"email",placeholder:"Email",value:s.seller.email,onChange:t=>l(a=>({...a,seller:{...a.seller,email:t.target.value}})),className:"input-field"}),e.jsx("input",{type:"tel",placeholder:"Telefon",value:s.seller.phone,onChange:t=>l(a=>({...a,seller:{...a.seller,phone:t.target.value}})),className:"input-field"})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("h2",{className:"text-xl font-bold text-white mb-4",children:"📥 Nabywca (Klient)"}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("input",{type:"text",placeholder:"Nazwa firmy/klienta",value:s.buyer.name,onChange:t=>l(a=>({...a,buyer:{...a.buyer,name:t.target.value}})),className:"input-field"}),e.jsx("input",{type:"text",placeholder:"Adres (ulica, kod, miasto)",value:s.buyer.address,onChange:t=>l(a=>({...a,buyer:{...a.buyer,address:t.target.value}})),className:"input-field"}),e.jsx("input",{type:"text",placeholder:"NIP",value:s.buyer.nip,onChange:t=>l(a=>({...a,buyer:{...a.buyer,nip:t.target.value}})),className:"input-field"}),e.jsx("input",{type:"email",placeholder:"Email",value:s.buyer.email,onChange:t=>l(a=>({...a,buyer:{...a.buyer,email:t.target.value}})),className:"input-field"})]})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("h2",{className:"text-xl font-bold text-white mb-4",children:"📄 Dane faktury"}),e.jsxs("div",{className:"grid md:grid-cols-2 lg:grid-cols-4 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-300 mb-1",children:"Numer faktury"}),e.jsx("input",{type:"text",value:s.invoiceNumber,onChange:t=>l(a=>({...a,invoiceNumber:t.target.value})),className:"input-field"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-300 mb-1",children:"Data wystawienia"}),e.jsx("input",{type:"date",value:s.issueDate,onChange:t=>l(a=>({...a,issueDate:t.target.value})),className:"input-field"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-300 mb-1",children:"Data sprzedaży"}),e.jsx("input",{type:"date",value:s.saleDate,onChange:t=>l(a=>({...a,saleDate:t.target.value})),className:"input-field"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-300 mb-1",children:"Termin płatności"}),e.jsx("input",{type:"date",value:s.dueDate,onChange:t=>l(a=>({...a,dueDate:t.target.value})),className:"input-field"})]})]})]}),e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("h2",{className:"text-xl font-bold text-white",children:"🛒 Pozycje faktury"}),e.jsxs("button",{onClick:g,className:"btn-primary flex items-center gap-2",children:[e.jsx(S,{className:"w-4 h-4"}),"Dodaj pozycję"]})]}),s.items.length===0?e.jsxs("div",{className:"text-center py-8 text-gray-400",children:[e.jsx(m,{className:"w-12 h-12 mx-auto mb-2 opacity-50"}),e.jsx("p",{children:'Brak pozycji. Kliknij "Dodaj pozycję" aby rozpocząć.'})]}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-gray-700",children:[e.jsx("th",{className:"text-left p-2 text-gray-300",children:"Nazwa"}),e.jsx("th",{className:"text-center p-2 text-gray-300",children:"Ilość"}),e.jsx("th",{className:"text-right p-2 text-gray-300",children:"Cena jedn."}),e.jsx("th",{className:"text-center p-2 text-gray-300",children:"VAT %"}),e.jsx("th",{className:"text-right p-2 text-gray-300",children:"Netto"}),e.jsx("th",{className:"text-right p-2 text-gray-300",children:"VAT"}),e.jsx("th",{className:"text-right p-2 text-gray-300",children:"Brutto"}),e.jsx("th",{className:"text-center p-2"})]})}),e.jsx("tbody",{children:s.items.map(t=>e.jsxs("tr",{className:"border-b border-gray-800",children:[e.jsx("td",{className:"p-2",children:e.jsx("input",{type:"text",placeholder:"Nazwa produktu/usługi",value:t.name,onChange:a=>d(t.id,"name",a.target.value),className:"input-field w-full"})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{type:"number",min:"1",step:"1",value:t.quantity,onChange:a=>d(t.id,"quantity",a.target.value),className:"input-field w-20 text-center"})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{type:"number",min:"0",step:"0.01",value:t.unitPrice,onChange:a=>d(t.id,"unitPrice",a.target.value),className:"input-field w-28 text-right"})}),e.jsx("td",{className:"p-2",children:e.jsxs("select",{value:t.vatRate,onChange:a=>d(t.id,"vatRate",a.target.value),className:"input-field w-20 text-center",children:[e.jsx("option",{value:"23",children:"23%"}),e.jsx("option",{value:"8",children:"8%"}),e.jsx("option",{value:"5",children:"5%"}),e.jsx("option",{value:"0",children:"0%"})]})}),e.jsxs("td",{className:"p-2 text-right text-white",children:[t.netAmount.toFixed(2)," zł"]}),e.jsxs("td",{className:"p-2 text-right text-gray-300",children:[t.vatAmount.toFixed(2)," zł"]}),e.jsxs("td",{className:"p-2 text-right text-primary-400 font-bold",children:[t.grossAmount.toFixed(2)," zł"]}),e.jsx("td",{className:"p-2 text-center",children:e.jsx("button",{onClick:()=>y(t.id),className:"text-red-400 hover:text-red-300 p-1",title:"Usuń pozycję",children:e.jsx($,{className:"w-4 h-4"})})})]},t.id))})]})}),s.items.length>0&&e.jsx("div",{className:"mt-6 flex justify-end",children:e.jsxs("div",{className:"w-full md:w-96 space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-gray-300",children:[e.jsx("span",{children:"Suma netto:"}),e.jsxs("span",{className:"font-bold",children:[o.netTotal.toFixed(2)," zł"]})]}),e.jsxs("div",{className:"flex justify-between text-gray-300",children:[e.jsx("span",{children:"Suma VAT:"}),e.jsxs("span",{className:"font-bold",children:[o.vatTotal.toFixed(2)," zł"]})]}),e.jsxs("div",{className:"flex justify-between text-2xl text-primary-400 font-bold pt-2 border-t border-gray-700",children:[e.jsx("span",{children:"DO ZAPŁATY:"}),e.jsxs("span",{children:[o.grossTotal.toFixed(2)," zł"]})]})]})})]}),e.jsxs("div",{className:"card",children:[e.jsx("h2",{className:"text-xl font-bold text-white mb-4",children:"💳 Sposób płatności"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-300 mb-2",children:"Metoda płatności"}),e.jsxs("select",{value:s.paymentMethod,onChange:t=>l(a=>({...a,paymentMethod:t.target.value})),className:"input-field",children:[e.jsx("option",{value:"przelew",children:"Przelew bankowy"}),e.jsx("option",{value:"gotowka",children:"Gotówka"}),e.jsx("option",{value:"blik",children:"BLIK"}),e.jsx("option",{value:"karta",children:"Karta płatnicza"})]})]}),s.paymentMethod==="przelew"&&e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm text-gray-300 mb-2",children:"Numer konta bankowego"}),e.jsx("input",{type:"text",placeholder:"PL 00 0000 0000 0000 0000 0000 0000",value:s.bankAccount,onChange:t=>l(a=>({...a,bankAccount:t.target.value})),className:"input-field"})]})]})]}),e.jsxs("div",{className:"card",children:[e.jsx("h2",{className:"text-xl font-bold text-white mb-4",children:"📝 Uwagi (opcjonalnie)"}),e.jsx("textarea",{placeholder:"Dodatkowe informacje do faktury...",value:s.notes,onChange:t=>l(a=>({...a,notes:t.target.value})),className:"input-field resize-none",rows:3})]}),e.jsx("div",{className:"card bg-blue-900/20 border-blue-500/30",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(C,{className:"w-5 h-5 text-blue-400 mt-1 flex-shrink-0"}),e.jsxs("div",{className:"text-sm text-gray-300",children:[e.jsx("p",{className:"font-bold text-white mb-2",children:"Stawki VAT w Polsce:"}),e.jsxs("ul",{className:"space-y-1 ml-4 list-disc",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"23%"})," - standardowa (większość towarów i usług)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"8%"})," - obniżona (książki, restauracje, transport)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"5%"})," - preferencyjna (żywność podstawowa)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"0%"})," - zwolniona (eksport, niektóre usługi)"]})]}),e.jsx("p",{className:"mt-3 text-yellow-400",children:"⚠️ To narzędzie jest pomocą. W razie wątpliwości skonsultuj się z księgowym."})]})]})})]})};export{L as default};
