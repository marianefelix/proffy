import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';

import warningIcon from '../../assets/images/icons/warning.svg';

import './styles.css';
import api from '../../services/api';

function TeacherForm(){
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [bio, setBio] = useState('');
    const [subject, setSubject] = useState('');
    const [cost, setCost] = useState('');
    const [ scheduleItems, setscheduleItems ] = useState([
        { week_day: 0, from: '', to: ''}
    ]);
    const history = useHistory();

    function addNewScheduleItem(){
        //copia o que ja tinha no array de schedule e seta os novos valores no array
        setscheduleItems([
            ...scheduleItems,
            { week_day: 0, from: '', to: ''}
        ]);
    }

    function setSheduleItemValue(position: number, field: string, value: string){
        //percorre o array de schedule items
        const updateScheduleItems = scheduleItems.map((scheduleItem, index) => {
            //verifica se a posicao que ele quer alterar eh igual ao index do item do array
            //se for, retorna o novo valor
            if(index === position){
                return { ...scheduleItem, [field]: value}
            }
            //se nao, retorna o valor padrao, que ja estava no array de schedule items
            return scheduleItem;
        });

        //seta o array de schedule items 
        setscheduleItems(updateScheduleItems);
    }

    function handleCreateClass(e: FormEvent){
        //previne comportamento padrao do form
        e.preventDefault();

        api.post('classes', {
            name, 
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: scheduleItems
        }).then(() => { 
            alert('Cadastro realizado com sucesso!');
            history.push('/');
        }).catch(() => {
            alert('Deu ruim!');
        })

    }

    return(
        <div id="page-teacher-form" className="container">
            <PageHeader 
                title="Que incrível que você quer dar aulas."
                description= "O primeiro passo é preencher esse formulário de inscrição"
            />
            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <Input 
                            name="name" 
                            label="Nome completo"
                            value={name}
                            onChange={(e) => {setName(e.target.value)}}
                        />
                        <Input 
                            name="avatar" 
                            label="Avatar"
                            value={avatar}
                            onChange={(e) => {setAvatar(e.target.value)}}
                        />
                        <Input 
                            name="whatsapp" 
                            label="WhatsApp"
                            value={whatsapp}
                            onChange={(e) => {setWhatsapp(e.target.value)}}
                        />
                        <Textarea 
                            name="bio" 
                            label="Biografia"
                            value={bio}
                            onChange={(e) => {setBio(e.target.value)}}
                        />
                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>

                        <Select 
                            name="subject" 
                            label="Matéria"
                            value={subject}
                            onChange={(e) => {setSubject(e.target.value)}}
                            options={[
                                { value: 'Português', label: 'Português'},
                                { value: 'Matemática', label: 'Matemática'},
                                { value: 'Ciências', label: 'Ciências'},
                                { value: 'Geografia', label: 'Geografia'}, 
                                { value: 'História', label: 'História'},                            
                            ]}
                        />
                        <Input 
                            name="cost" 
                            label="Custo da sua hora por aula"
                            value={cost}
                            onChange={(e) => {setCost(e.target.value)}}
                        />
                    
                    </fieldset>

                    <fieldset>
                            <legend>
                                Horários disponíveis
                                <button type="button" onClick={addNewScheduleItem}>
                                    + Novo horário
                                </button>
                            </legend>
                            {
                                //percorre o array de schedule items 
                                //e retorna um schedule item para cada objeto do array
                                scheduleItems.map((scheduleItem, index) => {
                                    return(
                                        <div key={scheduleItem.week_day} className="schedule-item">
                                            <Select 
                                                name="week_day" 
                                                label="Dia da semana"
                                                value={scheduleItem.week_day}
                                                onChange={e => {setSheduleItemValue(index, 'week_day', e.target.value)}}
                                                options={[
                                                    { value: '0', label: 'Domingo'},
                                                    { value: '1', label: 'Segunda-feira'},
                                                    { value: '2', label: 'Terça-feira'},
                                                    { value: '3', label: 'Quarta-feira'}, 
                                                    { value: '4', label: 'Quinta-feira'},  
                                                    { value: '5', label: 'Sexta-feira'},    
                                                    { value: '6', label: 'Sábado'},                            
                                                ]}
                                            />
                                            <Input 
                                                name="from" 
                                                label="Das" 
                                                value={scheduleItem.from}
                                                type="time" 
                                                onChange={e => {setSheduleItemValue(index, 'from', e.target.value)}}
                                            />
                                            <Input 
                                                name="to" 
                                                label="Até" 
                                                value={scheduleItem.to}
                                                type="time" 
                                                onChange={e => {setSheduleItemValue(index, 'to', e.target.value)}}
                                            />
                                        </div>
                                    );
                                })
                            }
                            
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante"/>
                            Importante! <br />
                            Preencha todos os dados
                        </p>
                        <button type="submit">
                            Salvar cadastro
                        </button>
                    </footer>

                </form>
            </main>
        </div>
    )
}

export default TeacherForm;