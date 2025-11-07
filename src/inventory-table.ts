import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

type Item = {
    name: string;
    price: number;
    quantity: number;
}

@customElement("inventory-table")
export class InventoryTable extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
    `;
    data: Item[] = [
        { name: "ノートパソコン", price: 179600, quantity: 15000 },
        { name: "スマートフォン", price: 249600, quantity: 32000 },
        { name: "タブレット", price: 91200, quantity: 24000 },
        { name: "ワイヤレスイヤホン", price: 31600, quantity: 48000 },
        { name: "キーボード", price: 17800, quantity: 67000 },
        { name: "マウス", price: 6400, quantity: 89000 },
        { name: "モニター", price: 65600, quantity: 18000 },
        { name: "Webカメラ", price: 15600, quantity: 35000 },
        { name: "外付けHDD", price: 24800, quantity: 42000 },
        { name: "プリンター", price: 37800, quantity: 26000 },
        { name: "スピーカー", price: 49200, quantity: 31000 },
        { name: "充電器", price: 9000, quantity: 75000 },
        { name: "デスクライト", price: 13600, quantity: 53000 },
        { name: "オフィスチェア", price: 90400, quantity: 12000 },
        { name: "デスク", price: 57800, quantity: 9000 }
    ];

    render() {
        return html`
            <table-component .data=${this.data}>
                <text-cell slot="cells" key="name" title="商品名"></text-cell>
                <numeric-cell slot="cells" key="price" title="価格"></numeric-cell>
                <numeric-cell slot="cells" key="quantity" title="数量"></numeric-cell>
            </table-component>`;
    }
}