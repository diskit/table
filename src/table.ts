import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, queryAssignedElements, state } from "lit/decorators.js";


interface CellTemplate<T> {
    template: (value: T) => TemplateResult;
    get key(): string;
    get title(): string;
}



@customElement("table-component")
export class TableComponent extends LitElement {

    @queryAssignedElements({slot: "cells"})
    _assigned!: HTMLElement[];

    @property({ type: Array })
    data!: Array<any>; ;

    @state()
    private _cellTemplate: CellTemplate<any>[] = [];

    static styles = css`
        :host {
            display: block;
        }

        table {
            table-layout: fixed;
            border-collapse: collapse;
            width: 100%;
            th, td {
                border: 1px solid #ccc;
                padding: 4px 16px;
            }
        }

        th {
            background-color: #f5f5f5;
        }
    `;

    render() {
        return html`
            <slot name="cells" style="display: none" @slotchange=${this._handleSlotChange}></slot>
            <table>
                <caption><slot name="caption"></slot></caption>
                <thead>
                    <tr>
                        ${this._cellTemplate.map(v => html`<th>${v.title}</th>`)}
                    </tr>
                </thead>
                <tbody>
                    ${this.data.map(rowData => html`
                        <tr>
                            ${this._cellTemplate.map(v => html`<td>${v.template(rowData[v.key])}</td>`)}
                        </tr>
                    `)}
                </tbody>
            </table>
        `
    }

    private _handleSlotChange() {
        this._cellTemplate = this._assigned.filter(v => 'template' in v && typeof v.template === 'function').map(v => v as any as CellTemplate<any>);
    }
}


@customElement("text-cell")
export class TextCellRenderer extends LitElement implements CellTemplate<string> {

    @property()
    value: string = ''

    @property()
    key: string = ''

    @property()
    title: string = '';

    render() {
        return html`<div>${this.value}</div>`
    }

    template(value: string): TemplateResult {
        return html`<text-cell .value=${value}></text-cell>`;
    }
}

@customElement("bold-cell")
export class BoldCellRenderer extends LitElement implements CellTemplate<string> {

    @property()
    value: string = ''

    @property()
    key: string = ''
    @property()
    title: string = '';


    static styles = css`
        div {
            font-weight: bold;
        }
    `;

    render() {
        return html`<div>${this.value}</div>`
    }

    template(value: string): TemplateResult {
        return html`<bold-cell .value=${value}></bold-cell>`;
    }
}

@customElement("numeric-cell")
export class NumericCellRenderer extends LitElement implements CellTemplate<number> {
    @property({type: Number})
    value: number = 0

    @property()
    key: string = ''

    @property()
    title: string = '';


    static styles = css`
        div {
            text-align: right;
        }
    `;

    render() {
        return html`<div>${this.value.toLocaleString()}</div>`
    }

    template(value: number): TemplateResult {
        return html`<numeric-cell .value=${value}></numeric-cell>`;
    }
}
