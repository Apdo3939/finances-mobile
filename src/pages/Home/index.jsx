import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Text, Alert, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import moment from 'moment';
import { formatNumber } from 'react-native-currency-input';
import api from '../config/configApi';


const Separator = () => (
    <View style={styles.separator} />
);


export default function Home() {

    moment.locale();
    const navigator = useNavigation();

    const [saldo, setSaldo] = useState('');
    const [valorPagamentos,setValorPagamentos] = useState('');
    const [valorRecebimentos, setValorRecebimentos] = useState('');   
    const [lancamentos, setLacamentos] = useState('');
    const [dateView, setDateView] = useState({
        month,
        year
    });

    var dateCurrent = new Date();
    var year = dateCurrent.getFullYear();
    var month = dateCurrent.getMonth() + 1;

    const prev = async () => {
        if(dateView.month === 1){
            month = 12;
            year = dateView.year - 1;
        }else{
            month= dateView.month - 1;
            year = dateView.year;
        }
        setDateView({
            month,
            year
        })
        getLancamentos(month, year);
    }

    const next = async () => {
        if(dateView.month === 12){
            month = 1;
            year = dateView.year + 1;
        }else{
            month = dateView.month + 1;
            year = dateView.year;
        }
        setDateView({
            month,
            year
        })
        getLancamentos(month, year);
    }

    const getLancamentos = async (month, year) => {
        if ((month === undefined) && (year === undefined)) {
            var dateCurrent = new Date();
            var year = dateCurrent.getFullYear();
            var month = dateCurrent.getMonth() + 1;
            setDateView({
                month,
                year
            });
        }
        try {
            const res = await api.get('/listar/' + month + '/' + year);
            setLacamentos(res.data.lancamentos);
        } catch (error) {
            Alert.alert("", "Erro: nenhum lançamentos encontrados, tente mais tarde!");
        }

        listarSaldo();
    }

    const handleDelete = async (idLancamento) => {
        await api.delete("/apagar/" + idLancamento)
            .then(res => {
                Alert.alert("", res.data.message);
                getLancamentos();
            })
            .catch(err => {
                if (err.res) {
                    Alert.alert("", err.res.data.message);
                } else {
                    Alert.alert("", "Erro: nenhum lançamento apagado, tente mais tarde!");
                }
            })

    }

    const listarSaldo = async () => {
        try {
            const res = await api.get('/listar/' + month + '/' + year);
            setSaldo(res.data.saldo);
            setValorPagamentos(res.data.valorPagamentos)
            setValorRecebimentos(res.data.valorRecebimentos);
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
        <View style={styles.container}>
            <View style={styles.content}>
                
                <View style={styles.contentTitle}>
                    <Text>Listar informações financeiras</Text>
                    <TouchableOpacity onPress={() => navigator.navigate('Cadastro')}>
                        <Text>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
                
                <Separator />
                <View style={styles.contentButtonDate}>
                <TouchableOpacity onPress={() => prev()}>
                    <Text>Anterior</Text>
                </TouchableOpacity>
                <Text>{dateView.month + '/' + dateView.year}</Text>
                <TouchableOpacity onPress={() => next()}>
                    <Text>Proximo</Text>
                </TouchableOpacity>
                </View>
                <Separator />
                
                <View style= {styles.contentSaldo}>
                    <Text>Valor recebido: {
                        formatNumber(valorRecebimentos, {
                            separator: ',',
                            prefix: 'R$ ',
                            precision: 2,
                            delimiter: '.',
                            signPosition: 'beforePrefix',
                        })
                    } </Text>
                    <Text>Valor pago: {
                        formatNumber(valorPagamentos, {
                            separator: ',',
                            prefix: 'R$ ',
                            precision: 2,
                            delimiter: '.',
                            signPosition: 'beforePrefix',
                        })
                    }</Text>
                    <Text>Saldo: {
                        formatNumber(saldo, {
                            separator: ',',
                            prefix: 'R$ ',
                            precision: 2,
                            delimiter: '.',
                            signPosition: 'beforePrefix',
                        })
                    }</Text>
                </View>
                <Separator />
                
                <FlatList
                    data={lancamentos}
                    renderItem={({ item }) => (
                        <View style={styles.contentFlatlist}>
                            <Text>{item.id}</Text>
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
                            {item.tipo === 1 ? <Text>Débito</Text> : <Text>Crédito</Text> }
                            {item.status === 1 ? <Text>Pendente</Text> : <Text>Efetuado</Text>}
                            <Text>{moment(item.vencimento).format('DD/MM/YYYY')}</Text>
                            <View style={styles.contentButton}>
                                <TouchableNativeFeedback onPress={() => navigator.navigate('Edit', { idLancamento: item.id })} >
                                    <Text>Editar</Text>

                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => handleDelete(item.id)} >
                                    <Text>Apagar</Text>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    )}
                    keyExtractor={lancamento => String(lancamento.id)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f1f1f1',
    },
    content: {
        flex: 1,
        margin: 12,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    contentTitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginVertical: 4,
        padding: 8,
    },

    contentSaldo:{
        marginVertical: 4,
        padding: 8,
    },

    contentFlatlist: {
        marginTop: 16,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    contentButtonDate: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginVertical: 4,
        padding: 8,
    },

    contentButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginVertical: 4,
    },

    separator: {
        marginVertical: 4,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});