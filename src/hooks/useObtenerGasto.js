import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { db } from './../firebase/firebaseConfig';


const useObtenerGasto = (id) => {
    const [gasto, establecerGasto] = useState('');
    const history = useHistory();
    
    useEffect (() => {
        db.collection('gastos').doc(id).get()
        .then ((doc) => {
            // console.log(doc.data());
            if(doc.exists){
                establecerGasto(doc);
            } else { 
                history.push("/lista");
            }
        })
    }, [history, id]);
    
    
    
    
    return [gasto];
}

export default useObtenerGasto;