import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'; 

import './styles.css';

function TeacherItem(){
    return(
        <article className="teacher-item">
            <header>
                <img src="https://media-exp1.licdn.com/dms/image/C5603AQHwhk4ng2NsTg/profile-displayphoto-shrink_200_200/0?e=1602115200&v=beta&t=99mh5zG1pIA9dbCxWL9cb7jCOnMMm1zjyNbofSeQ3Qo" alt="Mariane Felix"/>
                <div>
                    <strong>Mariane Felix</strong>
                    <span>Lógica e Algoritmos</span>
                </div>
            </header>
            <p>
                Faço várias coisas bacanas.
                <br/>
                <br/>
                E mais outras coisas
            </p>

            <footer>
                <p>
                    Preço/hora
                    <strong>R$ 100,00</strong>
                </p>
                <button type="button">
                    <img src={whatsappIcon} alt="Whatsapp"/>
                    Entrar em contato
                </button>
            </footer>
        </article>
    );
}
export default TeacherItem;