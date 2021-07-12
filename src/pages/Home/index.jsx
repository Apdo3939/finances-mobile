import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Text, Alert, FlatList, TouchableOpacity, StyleSheet, View } from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import moment from 'moment';
import { formatNumber } from 'react-native-currency-input';
import { List } from 'react-native-paper';
import api from '../config/configApi';


const Separator = () => (
    <View style={styles.separator} />
);


export default function Home() {

    moment.locale();
    const navigator = useNavigation();

    const [saldo, setSaldo] = useState('');
    const [valorPagamentos, setValorPagamentos] = useState('');
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
        if (dateView.month === 1) {
            month = 12;
            year = dateView.year - 1;
        } else {
            month = dateView.month - 1;
            year = dateView.year;
        }
        setDateView({
            month,
            year
        })
        getLancamentos(month, year);
    }

    const next = async () => {
        if (dateView.month === 12) {
            month = 1;
            year = dateView.year + 1;
        } else {
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
                    <Text style={styles.titleText}>Listar informações financeiras</Text>
                    <TouchableOpacity
                        style={styles.cadastrarButton}
                        onPress={() => navigator.navigate('Cadastro')}>
                        <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.contentButtonDate}>
                    <TouchableOpacity
                        style={styles.cadastrarButton}
                        onPress={() => prev()}>
                        <Text style={styles.cadastrarButtonText}>Anterior</Text>
                    </TouchableOpacity>
                    <Text
                        style={styles.titleText}
                    >{dateView.month + '/' + dateView.year}</Text>
                    <TouchableOpacity
                        style={styles.cadastrarButton}
                        onPress={() => next()}>
                        <Text style={styles.cadastrarButtonText}>Proximo</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.contentSaldo}>
                    <Text style={styles.itemTextSuccess}>Valor recebido: {
                        formatNumber(valorRecebimentos, {
                            separator: ',',
                            prefix: 'R$ ',
                            precision: 2,
                            delimiter: '.',
                            signPosition: 'beforePrefix',
                        })
                    } </Text>
                    <Text style={styles.itemTextDanger}>Valor pago: {
                        formatNumber(valorPagamentos, {
                            separator: ',',
                            prefix: 'R$ ',
                            precision: 2,
                            delimiter: '.',
                            signPosition: 'beforePrefix',
                        })
                    }</Text>
                    <Text style={styles.saldoText}>Saldo: {
                        formatNumber(saldo, {
                            separator: ',',
                            prefix: 'R$ ',
                            precision: 2,
                            delimiter: '.',
                            signPosition: 'beforePrefix',
                        })
                    }</Text>
                </View>
                <List.AccordionGroup >
                    <FlatList
                        style={styles.contentFlatlist}
                        data={lancamentos}
                        renderItem={({ item }) => (
                            <List.Accordion title={item.nome} id={item.id}>
                                <View style={styles.contentFlatlistItens}>
                                    <Text style={styles.itemTextSuccess}>{
                                        formatNumber(item.valor, {
                                            separator: ',',
                                            prefix: 'R$ ',
                                            precision: 2,
                                            delimiter: '.',
                                            signPosition: 'beforePrefix',
                                        })
                                    }
                                    </Text>
                                    {item.tipo === 1 ? <Text style={styles.itemTextDanger}>Débito</Text> : <Text style={styles.itemTextSuccess}>Crédito</Text>}
                                    {item.status === 1 ? <Text style={styles.itemTextDanger}>Pendente</Text> : <Text style={styles.itemTextSuccess}>Efetuado</Text>}
                                    <Text style={styles.itemTextSuccess}>{moment(item.vencimento).format('DD/MM/YYYY')}</Text>
                                </View>
                                <View style={styles.contentButton}>
                                    <TouchableNativeFeedback
                                        style={styles.editarButton}
                                        onPress={() => navigator.navigate('Edit', { idLancamento: item.id })} >
                                        <Text style={styles.editarButtonText}>Editar</Text>

                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback
                                        style={styles.apagarButton}
                                        onPress={() => handleDelete(item.id)} >
                                        <Text style={styles.apagarButtonText}>Apagar</Text>
                                    </TouchableNativeFeedback>
                                </View>
                            </List.Accordion>
                        )}
                        keyExtractor={lancamento => String(lancamento.id)} />
                </List.AccordionGroup>
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
        textAlign: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C73B4',
        
    },

    contentSaldo: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginVertical: 4,
    },

    itemTextSuccess: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#007744",
        margin: 4,
    },

    itemTextDanger: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#ff0777",
        margin: 4,
    },

    saldoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#1C73B4",
        margin: 4,
    },

    contentFlatlist: {
        marginVertical: 4,
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
    },

    contentFlatlistItens:{
        paddingHorizontal: 12,
        paddingVertical: 4,
    },

    contentButtonDate: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginVertical: 4,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
    },

    contentButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginVertical: 4,
        padding: 8,
    },

    cadastrarButton: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#007744',
        padding: 4,

    },

    cadastrarButtonText: {
        color: '#007744',
        fontSize: 14,
        fontWeight: 'bold',
    },

    editarButton: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ff7700',
        padding: 4,
        marginHorizontal: 8,

    },

    editarButtonText: {
        color: '#ff7700',
        fontSize: 14,
        fontWeight: 'bold',
    },

    apagarButton: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ff0777',
        padding: 4,
        marginHorizontal: 8,

    },

    apagarButtonText: {
        color: '#ff0777',
        fontSize: 14,
        fontWeight: 'bold',
    },

    separator: {
        marginVertical: 4,
        borderBottomColor: '#1C73B4',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});