import { Request, Response } from 'express';

import db from '../database/connection';

export default class ConnectionsController{
    async index(request: Request, response: Response){
        const totalConnections = await db('connections').count('* as total');

        //quando sabe que o retorno vai ser so uma linha, pega a primeira posicao do array
        const { total } = totalConnections[0];

        return response.json({ total });
    }

    async create(request: Request, response: Response){
        const { user_id } = request.body;

        await db('connections').insert({
            user_id,
        });

        return response.status(201).send();
    }
}