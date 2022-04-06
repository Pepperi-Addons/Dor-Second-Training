import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';
import { v4 as uuid } from 'uuid'

const TABLE_NAME = 'Todos';

interface TodoObj {
    Name: string;
    Description: string;
    Completed: Boolean;
    DueDate: string;
    Key?: string;
}

class TodosService {

    papiClient: PapiClient
    addonUUID: string

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            token: client.OAuthAccessToken,
            baseURL: client.BaseURL,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
        this.addonUUID = client.AddonUUID;

    }

    getTodos(options) {
        return this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME).find(options);
    }

    createTodo(body: TodoObj) {
        body.Key = uuid()
        return this.updateTodo(body);
    }

    updateTodo(body: TodoObj) {
        return this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME).upsert(body);
    }

    deleteTodos(body) {
        body.forEach(async element => {
            let tempTodo: any = {
                Key: element,
                Hidden: true
            }
            await this.updateTodo(tempTodo);
        });
        return Promise.resolve("Deleted");
    }

    completeTodos(body) {
        body.forEach(async element => {
            let tempTodo: any = {
                Key: element,
                Completed: true
            }
            await this.updateTodo(tempTodo);
        });
        return Promise.resolve("Marked as done");
    }
    
    // For page block template
    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }
}

export default TodosService;