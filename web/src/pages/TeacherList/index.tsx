import React, { useState, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import Input from '../../components/Input';
import Select from '../../components/Select';

import api from '../../services/api';

import './styles.css';
import Loading from '../../components/Loading';

function TeacherList(){
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeek_day] = useState('');
    const [time, setTime] = useState('');
    const [teacherNotFound, setTeacherNotFound] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSearchTeachers(e: FormEvent){
        //previne o comportamento padrao do form
        e.preventDefault(); 

        setTeacherNotFound('');
        setError('');
        
        setLoading(true);
        try{
            //busca o proffy e todas as suas infos cadastradas
           //passando como parametro a materia, dia da semana e o horario

            const response = await api.get('classes', {
                params: {
                    subject,
                    week_day,
                    time
                }
            });

            //seta os dados da resposta no array teacher
            setTeachers(response.data);

            //verifica se a resposta eh vazia, 
            //se for, seta uma mensagem 
            if(response.data.length === 0){
                setTeacherNotFound('Nenhum proffy encontrado');
            }

            setLoading(false);

        } catch(err){
            if(err.response){
                if(err.response.data.message)
                   setError(err.response.data.message);
            }
            else{
                toast.error('Erro ao buscar proffys. Tente novamente');
            }
            
            setLoading(false);
        }
    }

    return(
        <div id="page-teacher-list" className="container">
            <ToastContainer />

            <PageHeader title="Esses são os proffys disponíveis">
                <form id="search-teachers" onSubmit={handleSearchTeachers}>
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
                    <Select 
                        name="week_day" 
                        label="Dia da semana"
                        value={week_day}
                        onChange={e => {setWeek_day(e.target.value)}}
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
                        type="time" 
                        name="time" 
                        label="Hora"
                        value={time}
                        onChange={e => {setTime(e.target.value)}}
                    />
                    <button type="submit">Buscar</button>
                </form>
            </PageHeader>

            <main>
                {//se error nao for vazio, ele sera mostrado na pagina
                error && (
                    <div className="error-message"> 
                        {error}
                    </div>
                )}
                {/* perccorre o array teachers, 
                e para cada item passa um objeto para TeacherItem 
                e retorna todas as infos do teacher */}
                {teachers.map((teacher: Teacher) => {
                    return <TeacherItem  key={teacher.id} teacher= {teacher} />;
                })}

                {//se teacheNotFound no for vazio, mostrar mensagem na pagina
                teacherNotFound && 
                <div className="teacher-not-found">
                    <span>
                        {teacherNotFound}
                    </span>
                </div>
                }

            </main>
            <Loading value={loading} />
        </div>
    )
}

export default TeacherList;
