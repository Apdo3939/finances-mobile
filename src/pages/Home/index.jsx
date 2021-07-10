import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native'
import { Text, Alert, FlatList } from 'react-native';
import moment from 'moment';
import { formatNumber } from 'react-native-currency-input';
import api from '../config/configApi';


export default function Home() {

    const [lancamentos, setLacamentos] = useState('');

    const getLancamentos = async () => {
        try {
            const res = await api.get('/listar/07/2021');
            console.log(res);
            setLacamentos(res.data.lancamentos);
        } catch (error) {
            Alert.alert("", "Erro: nenhum lançamentos encontrados, tente mais tarde!");
        }
    }

    useFocusEffect(
        useCallback(() => {
            getLancamentos();
        }, [])
    );

    return (
        <>
            <Text>Listar informações financeiras</Text>
            <FlatList
                data={lancamentos}
                renderItem={({ item }) => (
                    <>
                        <Text>{item.nome}</Text>
                        <Text>{
                            formatNumber(item.valor, {
                                separator: ',',
                                prefix: 'R$ ',
                                precision: 2,
                                delimiter: '.',
                                signPosition: 'beforePrefix',
                            })
                        }
                        </Text>
                        <Text>{item.tipo}</Text>
                        <Text>{item.status}</Text>
                        <Text>{moment(item.vencimento).format('DD/MM/YYYY')}</Text>
                    </>
                )}
                keyExtractor={lancamento => String(lancamento.id)} />
        </>
    );
}