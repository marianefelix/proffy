import express from 'express';
import db from './database/connection';
import covertHourToMinutes from './utils/convertHourToMinutes';

const routes = express.Router();

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

routes.post('/classes', async (request, response) => {
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
        });
    
        //recupera id do usuario registrado
        const user_id = insertedUsersIds[0];
    
        //insere aula
        const insertedClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id,
        });
    
        //recupera id da aula registrada
        const class_id = insertedClassesIds[0];
    
        //percorre o array de objetos passado
        const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return {
                class_id,
                week_day: scheduleItem.week_day,
                from: covertHourToMinutes(scheduleItem.from),
                to: covertHourToMinutes(scheduleItem.to),
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

});

export default routes;