import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    
    async index(request: Request, response: Response){
        const filters = request.query;
        
        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string; 

        //caso nao tenha algum desses parametros, retorna um erro
        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                message: 'Todos os campos devem ser preenchidos!'
            });
        }

        const timeInMinutes = convertHourToMinutes(time);

        //realiza o filtro
        const classes = await db('classes')
            //sub query para realizar a verificacao de week_day e time na tabela class schedule
            .whereExists(function() {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('class_schedule.class_id = classes.id')
                    .whereRaw('class_schedule.week_day = ??', [Number(week_day)])
                    .whereRaw('class_schedule.from <= ??', [timeInMinutes])
                    .whereRaw('class_schedule.to > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            //realiza inner join com a tabela de users para retornar todos os seus dados
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])


        return response.json(classes);

    }


    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
    
        try{
    
            //insere usuario
            const insertedUsersIds = await trx('users').insert({
                name, 
                avatar, 
                whatsapp,
                bio,
            }).returning('id');
        
            //recupera id do usuario registrado
            const user_id = insertedUsersIds[0];
        
            //insere aula
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            }).returning('id');
        
            //recupera id da aula registrada
            const class_id = insertedClassesIds[0];
        
            //percorre o array de objetos passado
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                };
            })
        
            //insere horario de aula
            await trx('class_schedule').insert(classSchedule);
        
            //realiza as alteracoes no banco em apenas uma transacao, caso todas sejam sucesso
            await trx.commit();
        
            //retorna criado com sucesso
            return response.status(201).send();
    
        } catch(err){
            //desfaz qualquer alteracao feita no banco
            await trx.rollback();
    
            return response.status(400).json({
                error: 'Unexpecting error while creating new class'
            })
        }
    
    }
}