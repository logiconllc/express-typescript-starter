import {Client} from "../models";
import {NotFoundError} from "../errors/NotFoundError";

export class ClientManager {

    constructor() {
    }

    public async createClient(clientId, clientSecret) {
        const newClient = new Client({clientId, clientSecret});
        return newClient.save();
    }

    public async updateClient(clientId, clientSecret) {
        // @ts-ignore
        const client = await Client.find<Client>({where: {clientId: clientId}});
        if (client) {
            client.clientId = clientId;
            client.clientSecret = clientSecret;
            return client.save();
        } else {
            throw new NotFoundError("No client found with that id");
        }
    }

    public async deleteClient(clientId) {
        // @ts-ignore
        const client = await Client.find<Client>({where: {clientId: clientId}});
        if (client) {
            return client.destroy();
        } else {
            throw new NotFoundError("No client found with that id");
        }
    }
}
