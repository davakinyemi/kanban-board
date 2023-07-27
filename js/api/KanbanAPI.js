import * as Util from './util.js';

export default class KanbanAPI {

    static getItems(columnId) {
        const column = Util.read().find(column => column.id == columnId);
        if(!column) {
            return [];
        }
        return column.items;
    }

    static insertItem(columnId, content) {
        const data = Util.read();
        const column = data.find(column => column.id == columnId);
        const item = {
            id: Math.floor(Math.random() * 100000),
            content
        };
        if(!column) {
            throw new Error('Column does not exist.');
        }
        column.items.push(item);
        Util.save(data);
        return item;
    }

    static updateItem(itemId, newProps) {
        const data = Util.read();
        const [item, currentColumn] = (() => {
            for (const column of data) {
                const item = column.items.find(item => item.id == itemId);
                if (item) {
                    return [item, column];
                }
            }
        })();

        if(!item) {
            throw new Error('Item not found.');
        }

        item.content = newProps.content === undefined ? item.content : newProps.content;

        // update column & position
        if(newProps.columnId !== undefined && newProps.position !== undefined) {
            const targetColumn = data.find(column => column.id == newProps.columnId);
            if(!targetColumn) {
                throw new Error('Target column not found.');
            }
            // delete item from it's current column
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

            // move item into it's new column and position
            targetColumn.items.splice(newProps.position, 0, item);
        }

        Util.save(data);

    }

    static deleteItem(itemId) {
        const data = Util.read();
        for(const column of data) {
            const item = column.items.find(item => item.id == itemId);
            if(item) {
                column.items.splice(column.items.indexOf(item), 1);
            }
        }

        Util.save(data);
    }

}
