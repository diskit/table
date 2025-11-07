import { Task } from "@lit/task";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, queryAssignedElements, state } from "lit/decorators.js";

@customElement("attribute-source-example-table")
export class AttributeSourceExampleTable extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
    `;

    json = [
        { id: 1, value: "山田太郎" },
        { id: 2, value: "鈴木花子" },
        { id: 3, value: "佐藤次郎" }
    ]

    render() {
        return html`
            <list-component .keys="${this.json.map(v => v.id.toString())}">
                <generic-cell slot="cells" data-source=${JSON.stringify(this.json)} title="氏名"></generic-cell>
            </list-component>`;
    }
}



type CellRenderer = {
    renderer: (key: string, attributes: Record<string, string>) => TemplateResult
    attributes: Record<string, string>
}


@customElement("list-component")
export class ListComponent extends LitElement {

    @queryAssignedElements({slot: "cells"})
    _assigned!: HTMLElement[];

    @property({ type: Array })
    keys!: Array<string>; ;

    @state()
    private _renderers: CellRenderer[] = [];

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
                <thead>
                    ${this._renderers.map(v => html`<th>${v.attributes.title}</th>`)}
                </thead>
                <tbody>
                    ${this.keys.map(key => html`
                        <tr>
                            ${this._renderers.map(v => html`<td>${v.renderer(key, v.attributes)}</td>`)}
                        </tr>
                    `)}
                </tbody>
            </table>
        `
    }

    private _handleSlotChange() {
        const v = this._assigned;
        this._renderers = v.map(v => ({ renderer: (key, attributes) => (v as any).template(key, attributes), attributes: this.attributeToObject(v.attributes) }));
    }

    private attributeToObject(attributes: NamedNodeMap): Record<string, string> {
        return Array.from(attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {} as Record<string, string>)
    }
}

@customElement('generic-cell')
export class AttributeSourceCellRenderer extends LitElement {

    @property({attribute: "data-source"})
    dataSource!: string
    @property()
    key!: string

    private _task = new Task(this, {
        task: async ([dataSource, key]) => {
            const data = JSON.parse(dataSource);
            return data.filter((v: { id: string, value: string }) => v.id.toString() === key)[0]?.value || ''
        },
        args: () => [this.dataSource, this.key]
    });

    template(key: string, attributes: Record<string, string>): TemplateResult {
        return html`<generic-cell key=${key} .dataSource=${attributes["data-source"]}></generic-cell>`;
    }

    render() {
        return this._task.render({
            complete: (result) => html`<div>${result}</div>`
        });
    }
}